"use client";

import { useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  inviteTeamMemberSchema,
  type InviteTeamMemberFormValues,
} from "@/lib/schemas/team-access";
import type { TeamAccessRole } from "@/types/team-access";

const ROLE_LABELS: Record<TeamAccessRole, string> = {
  admin: "Admin",
  technician: "Technician",
  viewer: "Viewer",
};

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) return null;
  return <p className="text-destructive text-xs">{message}</p>;
}

export function TeamAccessInviteDialog({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (values: InviteTeamMemberFormValues) => void;
}) {
  const form = useForm<InviteTeamMemberFormValues>({
    resolver: zodResolver(inviteTeamMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "admin",
    },
  });
  const role = form.watch("role");
  const roleLabel = ROLE_LABELS[role];

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-sm">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => onInvite(values))}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="e.g Amaka" className="h-14" {...form.register("firstName")} />
              <FieldError message={form.formState.errors.firstName?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="e.g Okeke" className="h-14" {...form.register("lastName")} />
              <FieldError message={form.formState.errors.lastName?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="name@company.com" className="h-14" {...form.register("email")} />
            <FieldError message={form.formState.errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="h-14" placeholder="Create a password" {...form.register("password")} />
            <FieldError message={form.formState.errors.password?.message} />
          </div>

          <div className="space-y-2">
            <Label>Access role</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full h-14">
                <Button type="button" variant="outline" className="min-w-full h-14 border border-[#E8E8E8] justify-between rounded-lg px-3">
                  <span>{roleLabel}</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[14rem]">
                {(["admin", "technician", "viewer"] as TeamAccessRole[]).map((item) => (
                  <DropdownMenuItem
                    key={item}
                    className={cn(
                      "flex items-center justify-between",
                      role === item && "bg-muted font-medium",
                    )}
                    onClick={() => {
                      form.setValue("role", item, { shouldValidate: true });
                    }}
                  >
                    <span>{ROLE_LABELS[item]}</span>
                    {role === item ? <Check className="size-4" /> : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" className="h-12 border border-[]" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black hover:bg-black h-12">Send Invitation</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
