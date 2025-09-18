export default interface IResource {
  collection(list: Array<object>): Array<any>;

  single(data: object): any
}
