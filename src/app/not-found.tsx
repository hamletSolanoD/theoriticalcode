// app/not-found.tsx
import { Container, Title, Text, Button, Group, rem } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container
      style={{
        paddingTop: rem(80),
        paddingBottom: rem(80),
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: rem(220),
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: rem(16),
            color: 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
          }}
        >
          404
        </div>

        <Title
          order={1}
          style={{
            fontSize: rem(38),
            fontWeight: 900,
            marginBottom: rem(16),
          }}
        >
          Page not found
        </Title>

        <Text
          c="dimmed"
          size="lg"
          style={{
            maxWidth: rem(500),
            margin: '0 auto',
            marginBottom: rem(32),
          }}
        >
          The page you are trying to access does not exist. It may have been moved or deleted.
          Please check the URL or return to the home page.
        </Text>

        <Group justify="center">
          <Button
            component={Link}
            href="/"
            size="md"
            leftSection={<IconArrowLeft size={20} />}
          >
            Take me back to home
          </Button>
        </Group>
      </div>
    </Container>
  );
}