import type { NextPage } from 'next';
import cn from 'classnames';
import { useState, useMemo, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';

import { Label, Input, Button} from '../components/Form';

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
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);

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

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="container mx-auto p-2">
      <h1 className="text-2xl px-2 mb-4">Public key encoder</h1>

      <div className="flex flex-row min-h-screen">
        <div className="flex-initial w-48 pl-2 pr-4 border-r mr-4">
          <div className='flex justify-between'>
            <p className="text-xl mb-3">Keys</p>
            <Button
              className="mb-4"
              onClick={() => setIsAddingNew(!isAddingNew)}
            >
              {isAddingNew ? 'Cancel' : 'Add new'}
            </Button>
          </div>
          
          <ul className="list-none">
            {isLoaded && localKeys.map((key, i) => (
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
                <Input
                  name="newName"
                  className="mb-2"
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
                <Input
                  type="textarea"
                  name="newKey"
                  className="mb-4"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
                <Button
                  className="disabled:bg-gray-200"
                  disabled={!newName || !newKey || keyExists}
                  onClick={saveNewKey}
                >
                  Save
                </Button>
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
