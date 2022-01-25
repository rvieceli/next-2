import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState<string>();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleView = (url: string): void => {
    setImageUrl(url);
    onOpen();
  };

  return (
    <>
      <SimpleGrid columns={3} gap="10">
        {cards.map(image => (
          <Card key={image.id} data={image} viewImage={handleView} />
        ))}
      </SimpleGrid>

      <ModalViewImage imgUrl={imageUrl} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
