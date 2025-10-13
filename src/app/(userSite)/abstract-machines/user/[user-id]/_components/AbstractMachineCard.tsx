// src/app/(userSite)/abstract-machines/user/[user-id]/(owner)/_components/AbstractMachineCard.tsx
"use client";

import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Avatar,
  ActionIcon,
  Menu,
  Tooltip,
} from "@mantine/core";
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconArchive,
  IconUsers,
  IconClock,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { MachineType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface AbstractMachineCardProps {
  machine: {
    id: string;
    name: string;
    description: string | null;
    type: MachineType;
    updatedAt: Date;
    createdBy: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
    owners: Array<{
      role: string;
      user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
      };
    }>;
    _count: {
      snapshots: number;
    };
  };
}

const machineTypeColors: Record<MachineType, string> = {
  TURING: "blue",
  AFD: "green",
  AFND: "orange",
  PDA: "violet",
};

const machineTypeLabels: Record<MachineType, string> = {
  TURING: "Turing",
  AFD: "AFD",
  AFND: "AFND",
  PDA: "PDA",
};

export function AbstractMachineCard({ machine }: Readonly<AbstractMachineCardProps>) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/abstract-machines/${machine.id}`);
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: "pointer", height: "100%" }}
      onClick={handleCardClick}
    >
      <Stack gap="sm" h="100%">
        <Group justify="space-between" wrap="nowrap">
          <Badge color={machineTypeColors[machine.type]} variant="light">
            {machineTypeLabels[machine.type]}
          </Badge>
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={(e) => e.stopPropagation()}
              >
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit size={14} />}>
                Editar
              </Menu.Item>
              <Menu.Item leftSection={<IconArchive size={14} />}>
                Archivar
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                Eliminar
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Stack gap="xs" style={{ flex: 1 }}>
          <Text fw={600} size="lg" lineClamp={2}>
            {machine.name}
          </Text>
          {machine.description && (
            <Text size="sm" c="dimmed" lineClamp={2}>
              {machine.description}
            </Text>
          )}
        </Stack>

        <Stack gap="xs">
          <Group gap="xs" wrap="nowrap">
            <IconClock size={14} />
            <Text size="xs" c="dimmed">
              {formatDistanceToNow(new Date(machine.updatedAt), {
                addSuffix: true,
                locale: es,
              })}
            </Text>
          </Group>

          <Group justify="space-between" wrap="nowrap">
            <Group gap={4}>
              <Tooltip
                label={machine.createdBy.name ?? machine.createdBy.email}
                position="bottom"
              >
                <Avatar
                  src={machine.createdBy.image}
                  size="sm"
                  radius="xl"
                  alt={machine.createdBy.name ?? "Usuario"}
                />
              </Tooltip>
              {machine.owners.length > 1 && (
                <Group gap={4}>
                  <IconUsers size={14} />
                  <Text size="xs" c="dimmed">
                    +{machine.owners.length - 1}
                  </Text>
                </Group>
              )}
            </Group>

            {machine._count.snapshots > 0 && (
              <Text size="xs" c="dimmed">
                {machine._count.snapshots}{" "}
                {machine._count.snapshots === 1 ? "snapshot" : "snapshots"}
              </Text>
            )}
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}