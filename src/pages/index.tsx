import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam }) => {
      const { data: images } = await api.get('/api/images', {
        params: { after: pageParam },
      });
      return images;
    },
    {
      getNextPageParam: lastPage => lastPage?.after,
    }
  );

  const formattedData = useMemo(() => {
    if (!data) {
      return [];
    }

    return data?.pages.reduce((acc, page) => {
      acc.push(...page.data);
      return acc;
    }, []);
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            marginTop="10"
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
