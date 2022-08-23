import type { NextPage } from 'next';
import cn from 'classnames';
import { useState, useMemo } from 'react';
import useLocalStorage from 'use-local-storage';

import Label from '../components/Label';

interface LocalKey {
  name: string;
  key: string;
}

const Home: NextPage = () => {
  const [localKeys, setLocalKeys] = useLocalStorage<LocalKey[]>('keys', []);
  const [currentKey, setCurrentKey] = useState<LocalKey | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<Boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newKey, setNewKey] = useState<string>('');

  const keyExists = useMemo<boolean>(
    () => !!localKeys.find((key) => key.name === newName),
    [newName]
  );

  const saveNewKey = () => {
    setLocalKeys([
      {
        name: newName,
        key: newKey,
      },
      ...localKeys,
    ]);
    setNewName('');
    setNewKey('');
    setIsAddingNew(false);
  };

  const removeKey = (name: string) => {
    if (confirm('sure?'))
      setLocalKeys(localKeys.filter((key) => key.name !== name));
  };

  return (
    <main className="container mx-auto p-2">
      <h1 className="text-2xl px-2 mb-4">Public key encoder</h1>
      <div className="flex flex-row min-h-screen">
        <div className="flex-initial w-48 pl-2 pr-4 border-r mr-4">
          <div className='flex justify-between'>
            <p className="text-xl mb-3">Keys</p>
            <button
              className="block uppercase shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-2 px-5 rounded mb-4"
              onClick={() => setIsAddingNew(!isAddingNew)}
            >
              {isAddingNew ? 'Cancel' : 'Add new'}
            </button>
          </div>
          
          <ul className="list-none">
            {localKeys.map((key, i) => (
              <li
                key={`key_${i}`}
                className={cn('', {
                  'bg-blue-300': currentKey?.key === key.name,
                })}
              >
                <button
                  className="bg-red-500 text-white px-1 text-sm mr-2 cursor-pointer"
                  onClick={() => removeKey(key.name)}
                >
                  X
                </button>
                <button onClick={() => setCurrentKey(key)}>{key.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-auto">
          {isAddingNew && (
            <div>
              <div>
                <Label htmlFor="newName">Name:</Label>
                <input
                  name="newName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                {keyExists && (
                  <span className="block text-sm mb-2 text-red-500">
                    There's a key with this name already.
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="newKey">Key:</Label>
                <textarea
                  name="newKey"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
                <button
                  className="block uppercase shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-2 px-5 rounded disabled:bg-gray-200"
                  disabled={!newName || !newKey || keyExists}
                  onClick={saveNewKey}
                >
                  Save
                </button>
              </div>
            </div>
          )}
          {!isAddingNew && (
            <div>
              <h2 className="text-xl mb-4">Encode</h2>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
