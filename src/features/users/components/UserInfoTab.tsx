import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Button } from "@shared/ui/button";
import {
  createUserSchema,
  createUserDefaultValues,
  type TCreateUserSchema,
} from "../schemas/createUserSchema";
import { useCreateUserMutation } from "../store/usersApi";
import type { IPersonWithUserStatus } from "@features/people/store/peopleApi";

interface UserInfoTabProps {
  person: IPersonWithUserStatus;
  onSuccess: () => void;
  onBack: () => void;
}

export function UserInfoTab({ person, onSuccess, onBack }: UserInfoTabProps) {
  const { t } = useTranslation();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const form = useForm<TCreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      ...createUserDefaultValues,
      personId: person.personId,
      email: person.email ?? "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: TCreateUserSchema) => {
    const result = await createUser({
      personId: data.personId,
      email: data.email,
      role: data.role,
    });

    if ("data" in result) {
      form.reset();
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("users.fields.email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("users.wizard.emailPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("users.fields.role")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("users.wizard.rolePlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="User">
                      {t("users.roles.user")}
                    </SelectItem>
                    <SelectItem value="Admin">
                      {t("users.roles.admin")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onBack}>
            {t("users.wizard.back")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("users.wizard.creating")
              : t("users.wizard.createUser")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
