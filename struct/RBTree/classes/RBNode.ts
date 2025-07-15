export class RBNode<T> {
    data: T;
    color: 'red' | 'black';
    left: RBNode<T> | null = null;
    right: RBNode<T> | null = null;
    parent: RBNode<T> | null = null;

    constructor(data: T) {
        this.data = data;
        this.color = 'red';
    }
}
  