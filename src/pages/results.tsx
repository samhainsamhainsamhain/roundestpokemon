import type { GetServerSideProps } from 'next';
import { prisma } from '@/backend/utils/prisma';
import { AsyncReturnType } from '@/utils/ts-bs';

import Image from 'next/image';
import Link from 'next/link';

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: 'desc' },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { VoteFor, VoteAgainst } = pokemon._count;
  if (VoteFor + VoteAgainst === 0) {
    return 0;
  }
  return (VoteFor / (VoteFor + VoteAgainst)) * 100;
};

const PokemonListing: React.FC<{
  pokemon: PokemonQueryResult[number];
}> = ({ pokemon }) => {
  return (
    <div className="flex border-b p-4 justify-between items-center">
      <div className="flex items-center">
        <Image
          src={pokemon.spriteUrl}
          width={64}
          height={64}
          layout={'fixed'}
        />
        <div className="capitalize pr-2">{pokemon.name}</div>
      </div>
      <div className="pr-4">
        {generateCountPercent(pokemon).toPrecision(3) + '%'}
      </div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl p-4">Results</h2>
        <div className="flex flex-col w-full max-w-2xl border">
          {props.pokemon
            .sort((a, b) => generateCountPercent(b) - generateCountPercent(a))
            .map((currentPokemon, index) => {
              return <PokemonListing pokemon={currentPokemon} key={index} />;
            })}
        </div>
      </div>
      <div className="w-full text-xl text-center pb-4 pt-2">
        <a href="https://github.com/samhainsamhainsamhain/roundestpokemon">
          Github
        </a>
        {' | '}
        <Link href={'/'}>
          <a>Vote</a>
        </Link>
      </div>
    </>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};
