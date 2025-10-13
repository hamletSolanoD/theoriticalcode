// src/app/(userSite)/abstract-machines/user/[user-id]/(owner)/_components/AllAbstractMachines.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Title,
  TextInput,
  Select,
  Group,
  SimpleGrid,
  Pagination,
  Text,
  Skeleton,
  Alert,
  Stack,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch, IconAlertCircle } from "@tabler/icons-react";
import { MachineType } from "@prisma/client";
import { api } from "~/trpc/react";
import { AbstractMachineCard } from "./AbstractMachineCard";

interface AllAbstractMachinesProps {
  userId: string;
}

const ITEMS_PER_PAGE = 12;

const machineTypeLabels: Record<MachineType, string> = {
  TURING: "Máquina de Turing",
  AFD: "Autómata Finito Determinista",
  AFND: "Autómata Finito No Determinista",
  PDA: "Autómata de Pila",
};

export function AllAbstractMachines({ userId }: Readonly<AllAbstractMachinesProps>) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [typeFilter, setTypeFilter] = useState<MachineType | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = api.usersAbstractMachine.getUserMachines.useQuery({
    userId,
    isArchived: false,
    type: typeFilter ?? undefined,
    orderBy: "updatedAt",
    orderDirection: "desc",
    take: ITEMS_PER_PAGE,
    skip: (page - 1) * ITEMS_PER_PAGE,
  });

  const filteredMachines = data?.machines.filter((machine) =>
    machine.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const totalPages = Math.ceil((filteredMachines?.length ?? 0) / ITEMS_PER_PAGE);

  const renderLoadingState = () => (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i+"AbstractMachine"} height={200} radius="md" />
      ))}
    </SimpleGrid>
  );

  const renderEmptyState = () => (
    <Box py="xl">
      <Text c="dimmed" ta="center">
        {debouncedSearch || typeFilter
          ? "No se encontraron máquinas con los filtros aplicados"
          : "No tienes máquinas creadas"}
      </Text>
    </Box>
  );

  const renderMachinesGrid = () => (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
        {filteredMachines!.map((machine) => (
          <AbstractMachineCard key={machine.id} machine={machine} />
        ))}
      </SimpleGrid>

      {totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </Group>
      )}
    </>
  );

  const renderContent = () => {
    if (isLoading) return renderLoadingState();
    if (!filteredMachines?.length) return renderEmptyState();
    return renderMachinesGrid();
  };

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
        {error.message}
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      <Title order={2}>Todas las Máquinas</Title>

      <Group gap="md">
        <TextInput
          placeholder="Buscar máquinas..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filtrar por tipo"
          clearable
          value={typeFilter}
          onChange={(value) => setTypeFilter(value as MachineType | null)}
          data={[
            { value: "TURING", label: machineTypeLabels.TURING },
            { value: "AFD", label: machineTypeLabels.AFD },
            { value: "AFND", label: machineTypeLabels.AFND },
            { value: "PDA", label: machineTypeLabels.PDA },
          ]}
          style={{ minWidth: 250 }}
        />
      </Group>

      {renderContent()}
    </Stack>
  );
}