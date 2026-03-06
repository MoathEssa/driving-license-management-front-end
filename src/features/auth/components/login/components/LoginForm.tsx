import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLoginMutation } from "@features/auth/store/authApi";
import { setCredentials } from "@features/auth/store/authSlice";
import { useAppDispatch } from "@app/store";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import {
  loginFormSchema,
  loginFormSchemaDefaultValues,
  type TLoginFormSchema,
} from "../schemas/loginSchema";

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [triggerLogin, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TLoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormSchemaDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: TLoginFormSchema) => {
    const response = await triggerLogin({
      email: data.email,
      password: data.password,
    });

    if ("data" in response && response.data?.data) {
      dispatch(setCredentials(response.data.data));
      navigate("/", { replace: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.login.emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("auth.login.emailPlaceholder")}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.login.passwordLabel")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.login.passwordPlaceholder")}
                    autoComplete="current-password"
                    className="pe-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end -mt-1">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            {t("auth.login.forgotPassword")}
          </Link>
        </div>

        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {isLoading ? t("auth.login.signingIn") : t("auth.login.submitButton")}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
