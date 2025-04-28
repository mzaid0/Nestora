import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { signinApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { IApiError } from "@/types/api-error-type";

import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-zA-Z0-9]/, "Password must be alphanumeric"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Signin() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { isPending, error, mutate, reset, isError } = useMutation({
    mutationFn: signinApi,
    mutationKey: ["signin"],
    onSuccess: (data) => {
      toast.success("Success", {
        description: (
          <span className="text-xs text-gray-600">{data.message}</span>
        ),
      });
      navigate("/");
    },

    onError: (error: IApiError) => {
      toast.error("Error", {
        description: (
          <span className="text-xs text-gray-600">
            {error.response?.data?.message || "Network Error"}
          </span>
        ),
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    reset();
    mutate(values);
  };

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
      <Card className="mx-auto w-full sm:max-w-md md:max-w-lg mt-5">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Display mutation error */}
              {isError && (
                <p className="text-red-600">{error?.response?.data?.message}</p>
              )}

              <div className="grid gap-4">
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          placeholder="username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Sign In
              </Button>
            </form>
          </Form>

          <Button variant="outline" className="w-full mt-2">
            Continue with Google
          </Button>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="underline">
              Signup
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
