// TODAS  las maquinas de un usuario en especifico, ahora ya dependiendo si esta siendo visto
//dedsde la sesion del mismo usuario habra unas opciones o si es visto
//desde otro usuario habra otras opciones// src/app/(userSite)/abstract-machines/user/[user-id]/(owner)/page.tsx
"use client";

import { useParams } from "next/navigation";
import { Container, Stack, Title, Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { AllAbstractMachines } from "../_components/AllAbstractMachines";
import { RecentAbstractMachines } from "../_components/RecentAbstractMachines";


export default function UserAbstractMachinesPage() {
  const params = useParams();
  const userId = params["user-id"] as string;

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={1}>Mis Máquinas Abstractas</Title>
          <Button leftSection={<IconPlus size={18} />} size="md">
            Nueva Máquina
          </Button>
        </Group>

        <RecentAbstractMachines userId={userId} />

        <AllAbstractMachines userId={userId} />
      </Stack>
    </Container>
  );
}