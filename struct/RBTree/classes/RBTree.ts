import { RBNode } from './RBNode';

export type RotationType = 'Left' | 'Right' | 'Left-Right' | 'Right-Left';

export interface RotationRecord<T> {
    type: RotationType;
    nodes: T[];
}

export class RBTree<T> {
    root: RBNode<T> | null = null;
    rotations: RotationRecord<T>[] = [];

    private rotateLeft(x: RBNode<T>) {
        const y = x.right!;
        x.right = y.left;
        if (y.left) y.left.parent = x;
        y.parent = x.parent;

        if (!x.parent) this.root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;

        y.left = x;
        x.parent = y;

        this.rotations.push({
            type: 'Left',
            nodes: [x.data, y.data],
        });
    }

    private rotateRight(y: RBNode<T>) {
        const x = y.left!;
        y.left = x.right;
        if (x.right) x.right.parent = y;
        x.parent = y.parent;

        if (!y.parent) this.root = x;
        else if (y === y.parent.left) y.parent.left = x;
        else y.parent.right = x;

        x.right = y;
        y.parent = x;

        this.rotations.push({
            type: 'Right',
            nodes: [y.data, x.data],
        });
    }

    private balanceAfterInsert(z: RBNode<T>) {
        let current = z;
        while (
            current.parent &&
            current.parent.color === 'red'
        ) {
            const parent = current.parent;
            const grandparent = parent.parent;
            if (!grandparent) break;

            if (parent === grandparent.left) {
                const uncle = grandparent.right;
                if (uncle && uncle.color === 'red') {
                    parent.color = 'black';
                    uncle.color = 'black';
                    grandparent.color = 'red';
                    current = grandparent;
                } else {
                    if (current === parent.right) {
                        current = parent;
                        this.rotateLeft(current);
                    }
                    parent.color = 'black';
                    grandparent.color = 'red';
                    this.rotateRight(grandparent);
                }
            } else {
                const uncle = grandparent.left;
                if (uncle && uncle.color === 'red') {
                    parent.color = 'black';
                    uncle.color = 'black';
                    grandparent.color = 'red';
                    current = grandparent;
                } else {
                    if (current === parent.left) {
                        current = parent;
                        this.rotateRight(current);
                    }
                    parent.color = 'black';
                    grandparent.color = 'red';
                    this.rotateLeft(grandparent);
                }
            }
        }
        this.root!.color = 'black';
    }

    insertWithPath(value: T): T[] {
        const path: T[] = [];
        const newNode = new RBNode<T>(value);

        if (!this.root) {
            this.root = newNode;
            newNode.color = 'black';
            return [value];
        }

        let current = this.root;
        let parent: RBNode<T> | null = null;

        while (current) {
            path.push(current.data);
            parent = current;
            if (value < current.data) current = current.left!;
            else current = current.right!;
        }

        newNode.parent = parent;
        if (value < parent!.data) parent!.left = newNode;
        else parent!.right = newNode;

        this.balanceAfterInsert(newNode);

        return [...path, value];
    }

    search(value: T): RBNode<T> | null {
        let current = this.root;
        while (current) {
            if (value === current.data) return current;
            else if (value < current.data) current = current.left!;
            else current = current.right!;
        }
        return null;
    }
}
