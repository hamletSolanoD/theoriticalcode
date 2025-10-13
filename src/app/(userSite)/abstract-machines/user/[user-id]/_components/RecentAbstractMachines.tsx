"use client";

import { Title, Text, Box, Skeleton, Alert } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconAlertCircle } from "@tabler/icons-react";
import { api } from "~/trpc/react";
import { AbstractMachineCard } from "./AbstractMachineCard";

interface RecentAbstractMachinesProps {
  userId: string;
}

export function RecentAbstractMachines({ userId }: Readonly<RecentAbstractMachinesProps>) {
  const { data, isLoading, error } = api.usersAbstractMachine.getUserMachines.useQuery({
    userId,
    isArchived: false,
    orderBy: "updatedAt",
    orderDirection: "desc",
    take: 6,
  });

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
        {error.message}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Title order={2} mb="md">
          Usadas Recientemente
        </Title>
        <Carousel
          slideSize="33.333333%"
          slideGap="md"
        >
          {[1, 2, 3].map((i) => (
            <Carousel.Slide key={i}>
              <Skeleton height={200} radius="md" />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>
    );
  }

  if (!data?.machines.length) {
    return (
      <Box>
        <Title order={2} mb="md">
          Usadas Recientemente
        </Title>
        <Text c="dimmed" ta="center" py="xl">
          No tienes máquinas recientes
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Title order={2} mb="md">
        Usadas Recientemente
      </Title>
      <Carousel
        slideSize="33.333333%"
        slideGap="md"
        withControls={data.machines.length > 3}
      >
        {data.machines.map((machine) => (
          <Carousel.Slide key={machine.id}>
            <AbstractMachineCard machine={machine} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}