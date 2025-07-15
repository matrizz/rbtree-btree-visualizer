import React, { useRef, useState } from 'react';
import { RBTree } from '../struct/RBTree/classes/RBTree';
import RBTreeCanvas from './components/RBTreeCanvas';
import type { RotationRecord } from '../struct/RBTree/classes/RBTree';
import { RBNode } from '../struct/RBTree/classes/RBNode';

export default function App() {
  const treeRef = useRef(new RBTree<number>());
  const [root, setRoot] = useState<RBNode<number> | null>(null);
  const [insertedCount, setInsertedCount] = useState(0);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [pathToDraw, setPathToDraw] = useState<number[]>([]);
  const [rotationInfo, setRotationInfo] = useState<RotationRecord<number> | null>(null);
  const [inputValue, setInputValue] = useState('');

  async function handleInsert(value: number) {
    setCurrentValue(value);
    setRotationInfo(null);

    const path = treeRef.current.insertWithPath(value);

    for (let i = 1; i <= path.length; i++) {
      setPathToDraw(path.slice(0, i));
      await new Promise(res => setTimeout(res, 300));
    }

    if (treeRef.current.rotations.length > 0) {
      const lastRotation = treeRef.current.rotations.shift()!;
      setRotationInfo(lastRotation);
      await new Promise(res => setTimeout(res, 600));
    }

    setRoot({ ...treeRef.current.root! });
    setInsertedCount(c => c + 1);
    setCurrentValue(null);
    setPathToDraw([]);
    setRotationInfo(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(inputValue);
    if (!Number.isFinite(num)) return;
    if (treeRef.current.search(num)) return;
    handleInsert(num);
    setInputValue('');
  }

  return (
    <div className="w-screen h-screen relative bg-gray-100">
      <div className="absolute top-4 left-4 z-10 text-black bg-white/80 rounded-lg shadow p-4 flex flex-col gap-2">
        <form onSubmit={onSubmit} className="flex gap-2 items-center">
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="border px-2 py-1 rounded"
            placeholder="Insira um número"
          />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Inserir</button>
        </form>
        <p>Inserted nodes: {insertedCount}</p>
        <p>Inserting: {currentValue ?? 'Done'}</p>
        <p>Rotation: {rotationInfo?.type ?? 'No rotation'}</p>
      </div>
      <RBTreeCanvas root={root} path={pathToDraw} rotation={rotationInfo} />
    </div>
  );
}
