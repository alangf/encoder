import type { NextPage } from 'next';
import cn from 'classnames';
import { useState, useMemo, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';
import copy from 'copy-to-clipboard'

import { encodeText } from '../crypto'

import { Label, Input, Button} from '../components/Form';

interface LocalKey {
  name: string;
  key: string;
}

const Home: NextPage = () => {
  const [localKeys, setLocalKeys] = useLocalStorage<LocalKey[]>('keys', []);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<Boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newKey, setNewKey] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [showCopied, setShowCopied] = useState<Boolean>(false)

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
    if (currentKey === name)
      setCurrentKey(null)
  };

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const encode = async () => {
    if (currentKey) {
      const key = localKeys.find(key => key.name === currentKey)
      if (key) {
        setTo(await encodeText(key.key, from) as string)
      }
    }
      
  }

  const selectKey = (name: string) => setCurrentKey(currentKey === name ? null : name)

  const copyTo = () => {
    copy(to)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

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
                className={cn('flex mb-2 p-1', {
                  'bg-indigo-300 rounded': currentKey === key.name,
                })}
              >
                <button
                  className="bg-red-500 text-white px-1 text-sm mr-2 cursor-pointer rounded"
                  onClick={() => removeKey(key.name)}
                >
                  X
                </button>
                <button className="flex-1 text-left" onClick={() => selectKey(key.name)}>{key.name}</button>
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
                  type="text"
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
          {!isAddingNew && currentKey && (
            <div>
              <h2 className="text-xl mb-4">Encode</h2>

              <Label htmlFor="from">Text to encode:</Label>
              <Input
                type="textarea"
                name="from"
                className="mb-4"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <Button
                className="disabled:bg-gray-200 mb-4"
                onClick={encode}
              >
                Encode
              </Button>

              <Label htmlFor="to">Encoded:</Label>
              <Input
                type="textarea"
                name="to"
                readOnly
                className="mb-4"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />

              <div className='flex'>
                <Button
                  className="disabled:bg-gray-200"
                  disabled={!to}
                  onClick={copyTo}
                >
                  Copy to clipboard
                </Button>
                {showCopied && <span className='text-green-500 text-sm ml-2 flex items-center'>Encoded text copied to clipboard</span>}
              </div>
            </div>
          )}
          {isLoaded && !isAddingNew && !currentKey && <span className='text-xl'>{
            localKeys.length
              ? 'Please add a new key to start encoding'
              : 'Please select a key to start encoding.'
          }</span>}
        </div>
      </div>
    </main>
  );
};

export default Home;
