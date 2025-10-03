// RUTA: src/components/features/auth/_components/WorkspaceSwitcher.tsx
/**
 * @file WorkspaceSwitcher.tsx
 * @description Componente de cliente para visualizar y cambiar el workspace activo.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { DynamicIcon } from "@/components/ui";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import { getWorkspacesForUserAction } from "@/shared/lib/actions/workspaces/getWorkspacesForUser.action";
import { Skeleton } from "@/components/ui/Skeleton";

export function WorkspaceSwitcher() {
  const {
    activeWorkspaceId,
    availableWorkspaces,
    setActiveWorkspace,
    setAvailableWorkspaces,
  } = useWorkspaceStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true);
      const result = await getWorkspacesForUserAction();
      if (result.success) {
        setAvailableWorkspaces(result.data);
      } else {
        toast.error("Error al cargar workspaces", {
          description: result.error,
        });
      }
      setIsLoading(false);
    };
    fetchWorkspaces();
  }, [setAvailableWorkspaces]);

  const activeWorkspace = availableWorkspaces.find(
    (ws) => ws.id === activeWorkspaceId
  );

  if (isLoading) {
    return (
      <div className="px-2 py-1.5">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Workspace Activo</DropdownMenuLabel>
      <div className="px-2 font-semibold text-foreground">
        {activeWorkspace?.name || "Ninguno"}
      </div>
      <DropdownMenuSeparator />
      {availableWorkspaces.map((workspace) => (
        <DropdownMenuItem
          key={workspace.id}
          onClick={() => setActiveWorkspace(workspace.id)}
          className="cursor-pointer"
        >
          {workspace.id === activeWorkspaceId && (
            <DynamicIcon name="Check" className="mr-2 h-4 w-4" />
          )}
          <span className={workspace.id !== activeWorkspaceId ? "ml-6" : ""}>
            {workspace.name}
          </span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
}
