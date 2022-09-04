import { useEffect, useState } from 'react';

const MAX_DEX_ID = 493;

export const getRandomPokemon: (notThisOne?: number) => number = (
  notThisOne
) => {
  const pokedexNumber = Math.floor(Math.random() * (MAX_DEX_ID + 1));

  if (pokedexNumber !== notThisOne) return pokedexNumber;
  return getRandomPokemon(notThisOne);
};

export const getOptionsForVote = () => {
  const firstId = getRandomPokemon();
  const secondId = getRandomPokemon(firstId);
  //use state to avoid mismatch of data on server and client
  const [ids, setIds] = useState([0, 0]);

  useEffect(() => {
    setIds([firstId, secondId]);
  }, []);

  return ids;
};
