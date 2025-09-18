import { BaseModel } from "@adonisjs/lucid/orm";
import { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";
import { DateFilter, Filter, Filters, PaginationData, SortType } from "#contracts/types/filter_types";
import { castByType, parseDate } from "#services/utils/helpers";
import { HttpContext } from "@adonisjs/core/http";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { DateTime } from "luxon";
import BaseResource from "#contracts/resource/base_resource";
import { SimplePaginatorContract } from "@adonisjs/lucid/types/querybuilder";
import db from '@adonisjs/lucid/services/db'

export default class BaseRepository<T extends typeof BaseModel> {
  protected transaction?: TransactionClientContract | undefined = undefined

  constructor(protected model: T) {}

  setTransaction(transaction: TransactionClientContract) {
    this.transaction = transaction
  }

  getOptions() {
    return { client: this.transaction }
  }

  query() {
    return this.model.query(this.getOptions())
  }

  find(key: string, value: any): Promise<InstanceType<T> | null> {
    return this.query().where(key, value).first()
  }

  findActive(key: string, value: any): Promise<InstanceType<T> | null> {
    return this.query().where(key, value).where('active', true).first()
  }

  create(payload: object) {
    return this.model.create(payload, this.getOptions())
  }

  createMany(payload: any[]) {
    return this.model.createMany(payload, this.getOptions())
  }

  firstOrCreate(find: object, create: object) {
    return this.model.firstOrCreate(find, create, this.getOptions())
  }

  public async tryPaginate(
    query: ModelQueryBuilderContract<any>,
    pageData: PaginationData | boolean,
    resource?: any
  ) {
    let result: any
    if (pageData != false) {
      pageData = pageData as PaginationData
      result = await query.paginate(pageData.page, pageData.perPage)
    } else {
      result = await query
    }

    if (!resource) {
      return result
    }

    if ('perPage' in result) {
      result = result as SimplePaginatorContract<any>
      return {
        meta: result.getMeta(),
        data: resource.collection(result.all()),
      }
    } else {
      return {
        data: resource.collection(result),
      }
    }
  }

  private getFilterValue(
    filter: Filter,
    request: HttpContext['request'],
    suffix?: string
  ) {
    let nullFilter = false

    const qsKey = suffix
      ? `${filter.paramName ?? filter.name}_${suffix}`
      : (filter.paramName ?? filter.name)
    const rawValue = request.qs()[qsKey]

    if (rawValue == '-1') {
      nullFilter = true
    }

    const data = castByType(rawValue, filter.type)

    if ([undefined, null, ''].includes(data)) {
      return undefined
    }

    return nullFilter ? null : data
  }

  update(data: object, model: InstanceType<T>) {
    if (this.transaction) {
      model.useTransaction(this.transaction)
    }
    model.merge(data)
    return model.save()
  }

  softDelete(model: InstanceType<T>) {
    if (this.transaction) {
      model.useTransaction(this.transaction)
    }
    ;(model as any).deletedAt = DateTime.now()

    if ((model as any).active !== undefined) {
      ;(model as any).active = false
    }

    return model.save()
  }

  filter(
    query: ModelQueryBuilderContract<T, InstanceType<T>>,
    filters: Filters,
    request: HttpContext['request']
  ) {
    const strategies: Record<string, (q: any, f: any, d: any) => any> = {
      where: (q, f, d) => q.where(f.name, d),
      like: (q, f, d) => q.whereILike(f.name, `%${d}%`),
      whereIn: (q, f, d) => q.whereIn(f.name, d),
      relationsWhere: (q, f, d) => this.filterRelations(q, f, d, false),
      relationsLike: (q, f, d) => this.filterRelations(q, f, d, true),
    }

    for (const key of Object.keys(strategies)) {
      const filterGroup = (filters as any)[key]
      if (!filterGroup) continue

      filterGroup.forEach((filter: Filter) => {
        const data = this.getFilterValue(filter, request, key === 'whereIn' ? 'in' : undefined)
        if (data !== undefined) query = strategies[key](query, filter, data)
      })
    }

    if (filters.dateBetween) query = this.filterDateBetween(query, filters.dateBetween, request)
    if (filters.sortable) query = this.sortData(query, filters.sortable, request)

    return query
  }

  sortData(
    query: ModelQueryBuilderContract<any>,
    sortables: string[],
    request: HttpContext['request']
  ) {
    sortables.forEach((sortBy) => {
      const sortType = request.qs()[`sort_${sortBy}`] as SortType | undefined

      if (sortType === 'asc' || sortType === 'desc') {
        query.orderBy(sortBy, sortType)
      }
    })

    return query
  }

  filterWhere(
    query: ModelQueryBuilderContract<any>,
    whereFilters: Array<Filter>,
    request: HttpContext['request'],
    like: boolean = false,
    relation: boolean = false
  ) {
    whereFilters.forEach((filter: Filter) => {
      let nullFilter = false
      const filterData = request.qs()[filter.name]
      if (filterData == '-1') {
        nullFilter = true
      }
      const data = castByType(request.qs()[filter.name], filter.type)

      if (![undefined, null, '', ''].includes(data)) {
        const filterData = nullFilter ? null : data
        if (relation) {
          query = this.filterRelations(query, filter, data, like)
        } else {
          !like ? query.where(filter.name, filterData) : query.whereILike(filter.name, `%${data}%`)
        }
      }
    })
    return query
  }

  filterRelations(
    query: ModelQueryBuilderContract<any>,
    filter: Filter,
    data: any,
    like: boolean = false
  ) {
    if (!filter.deep) {
      const [relationName, filterName] = filter.name.split('.')
      query.whereHas(relationName, (q) =>
        !like ? q.where(filterName, data) : q.whereILike(filterName, `%${data}%`)
      )
    } else {
      const relationInfo = filter.name.split('.')
      if (filter.deep != relationInfo.length - 1) {
        return query
      }
      query = this.mapRelationSubQuery(query, filter, relationInfo, data, like)
    }

    return query
  }

  mapRelationSubQuery(
    query: ModelQueryBuilderContract<any>,
    filter: Filter,
    relationInfo: string[],
    data: any,
    like: boolean = false
  ) {
    if (filter.deep == 0) {
      if (like) {
        return query.whereILike(relationInfo[0], `%${data}%`)
      } else {
        return query.where(relationInfo[0], data)
      }
    } else {
      filter.deep!--
      query.whereHas(relationInfo.shift()!.toString(), (q) =>
        this.mapRelationSubQuery(q, filter, relationInfo, data, like)
      )
    }
    return query
  }

  filterWhereIn(
    query: ModelQueryBuilderContract<any>,
    whereInFilters: Array<Filter>,
    request: HttpContext['request']
  ) {
    whereInFilters.forEach((filter: Filter) => {
      const data = castByType(request.qs()[`${filter.name}_in`], filter.type)
      if (![undefined, null, '', ''].includes(data)) {
        query.whereIn(filter.name, data)
      }
    })
    return query
  }

  filterDateBetween(
    query: ModelQueryBuilderContract<any>,
    dateBetweenFilters: Array<DateFilter>,
    request: HttpContext['request']
  ) {
    dateBetweenFilters.forEach((filter: DateFilter) => {
      let startDate: any = parseDate(request.qs()[filter.startName])
      let endDate: any = parseDate(request.qs()[filter.endName])
      if (startDate) {
        startDate = startDate.format('YYYY-MM-DD') + ' 00:00:00'
      }
      if (endDate) {
        endDate = endDate.format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (startDate && endDate) {
        query.where(filter.name, '>=', startDate).where(filter.name, '<=', endDate)
      } else if (startDate && !endDate) {
        query.where(filter.name, '>=', startDate)
      } else if (!startDate && endDate) {
        query.where(filter.name, '<=', endDate)
      }
    })
    return query
  }

  async exists(field: string, value: any, ignoreField?: string, ignoreValue?: any) {
    const q = this.query().select(['id']).where(field, value)
    if (ignoreField && ignoreValue) {
      q.whereNot(ignoreField, ignoreValue)
    }
    const result = await q.first()
    return result != null
  }

  loadRelations(
    query: ModelQueryBuilderContract<any>,
    loadable: string[],
    request: HttpContext['request']
  ) {
    const loadList = (request.qs()['load'] ?? '').split(',')
    for (const loadData of loadList) {
      if (loadable.includes(loadData)) {
        query.preload(loadData)
      }
    }
  }
}

