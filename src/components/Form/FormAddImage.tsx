import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormData {
  title: string;
  description: string;
  url: string;
}

interface FormAddImageProps {
  closeModal: () => void;
}

const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/gif'];

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast({ position: 'top-right' });

  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, unknown, FormData>(
    newImage => {
      return api.post<FormData>('/api/images', newImage);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm({});
  const { errors } = formState;

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({ description: 'Images url does exist', status: 'error' });
        return;
      }

      await mutation.mutateAsync({
        title: data.title,
        description: data.description,
        url: imageUrl,
      });

      toast({
        description: 'Image saved',
        title: 'Yeah',
      });

      closeModal();
    } catch {
      toast({ description: 'Something wrong', status: 'error' });
    } finally {
      reset();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', {
            required: true,
            validate: {
              lessThan10MB: ([value]) => value.size < 1024 * 1024 * 10,
              acceptedFormats: ([value]) =>
                ACCEPTED_FORMATS.includes(value.type),
            },
          })}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          error={errors.title}
          {...register('title', { required: true })}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          error={errors.description}
          {...register('description', { required: true })}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
