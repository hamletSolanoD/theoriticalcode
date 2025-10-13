import { useState } from 'react';
import {
  AppShell,
  Burger,
  Text,
  Avatar,
  Group,
  Box,
  Stack,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { IconRobot, IconSettings, IconChevronRight } from '@tabler/icons-react';

export default function Layout() {
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            hiddenFrom="sm"
            size="sm"
          />
          <Text size="xl" fw={700}>
            Abstract Machines
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section
          style={{
            paddingBottom: rem(16),
            marginBottom: rem(16),
            borderBottom: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
          }}
        >
          <UnstyledButton
            style={{
              display: 'block',
              width: '100%',
              padding: rem(12),
              borderRadius: 'var(--mantine-radius-sm)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Group>
              <Avatar
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                radius="xl"
              />
              <Box style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  Jane Doe
                </Text>
                <Text c="dimmed" size="xs">
                  jane@example.com
                </Text>
              </Box>
              <IconChevronRight size={14} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </AppShell.Section>

        <AppShell.Section grow>
          <Stack gap="xs">
            <UnstyledButton
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: rem(12),
                borderRadius: 'var(--mantine-radius-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                console.log('Navigate to My Abstract Machines');
              }}
            >
              <Group gap="sm" style={{ flex: 1 }}>
                <Box
                  style={{
                    width: rem(34),
                    height: rem(34),
                    borderRadius: 'var(--mantine-radius-sm)',
                    backgroundColor: 'light-dark(var(--mantine-color-blue-0), var(--mantine-color-dark-5))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconRobot size={20} />
                </Box>
                <Text size="sm" fw={500}>
                  My Abstract Machines
                </Text>
              </Group>
            </UnstyledButton>

            <UnstyledButton
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: rem(12),
                borderRadius: 'var(--mantine-radius-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Group gap="sm" style={{ flex: 1 }}>
                <Box
                  style={{
                    width: rem(34),
                    height: rem(34),
                    borderRadius: 'var(--mantine-radius-sm)',
                    backgroundColor: 'light-dark(var(--mantine-color-blue-0), var(--mantine-color-dark-5))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconSettings size={20} />
                </Box>
                <Text size="sm" fw={500}>
                  Settings
                </Text>
              </Group>
            </UnstyledButton>
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Text>Main content goes here</Text>
      </AppShell.Main>
    </AppShell>
  );
}