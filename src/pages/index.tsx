import { trpc } from '../utils/trpc';
import type { NextPage } from 'next';
import { getOptionsForVote } from '@/utils/getRandomPokemon';
import React, { useState } from 'react';
import { inferQueryResponse } from './api/trpc/[trpc]';

import Image from 'next/image';
import Link from 'next/link';

const btn =
  'inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }]);

  const voteMutation = trpc.useMutation(['cast-vote']);

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }

    updateIds(() => getOptionsForVote());
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center">
      <div className="text-2xl text-center pt-8">Which Pokemon is rounder?</div>
      {dataLoaded && (
        <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
          <PokemonListing
            pokemon={firstPokemon.data}
            vote={() => voteForRoundest(first)}
          />
          <div className="p-8">vs</div>
          <PokemonListing
            pokemon={secondPokemon.data}
            vote={() => voteForRoundest(second)}
          />
          <div className="p-2" />
        </div>
      )}
      {!dataLoaded && (
        <img className="max-w-64 max-h-64" src={'/circles.svg'} />
      )}
      <div className="w-full text-xl text-center pb-2">
        <a href="https://github.com/samhainsamhainsamhain/roundestpokemon">
          Github
        </a>
        {' | '}
        <Link href={'/results'}>
          <a>Results</a>
        </Link>
      </div>
    </div>
  );
};

export default Home;

type PokemonFromServer = inferQueryResponse<'get-pokemon-by-id'>;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={props.pokemon.spriteUrl}
        width={256}
        height={256}
        layout={'fixed'}
      />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};
