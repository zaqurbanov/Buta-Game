import IResource from "#contracts/resource/i_resource";

export default abstract class BaseResource implements IResource{
    collection(list: Array<object|string>): Array<any> {
      return list.map(e => this.format(e));
    }

    single(data: object|string): any {
        return this.format(data);
    }

    abstract format(data: object|string) : any;

}
