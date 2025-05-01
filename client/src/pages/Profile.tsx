"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, User } from "lucide-react";
import { useAppSelector } from "@/hooks/redux-hooks";

const formSchema = z.object({
  avatar: z
    .custom<File>()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 3 * 1024 * 1024),
      "Image must be less than 3MB"
    )
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Only image files are allowed"
    ),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AvatarUploadForm() {
  const { user } = useAppSelector((state) => state.user);
  const [preview, setPreview] = useState<string | null>(user?.avatar || null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { avatar: undefined },
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      </pre>
    );
  }

  return (
    <Form {...form}>
      <Card className="sm:max-w-2/3  mx-auto my-2 shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className=" text-sm font-medium">
                    Profile Picture
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <label
                        htmlFor="avatar"
                        className="cursor-pointer block"
                        title="Click to upload new photo"
                      >
                        <div className="relative w-32 h-32 rounded-full border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg">
                          {preview ? (
                            <Avatar className="w-full h-full">
                              <AvatarImage
                                src={preview}
                                alt="Avatar Preview"
                                className="object-cover rounded-full"
                              />
                              <AvatarFallback>
                                <User className="w-8 h-8 text-gray-400" />
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <User className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300 flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                            <span className="sr-only">Upload new photo</span>
                          </div>
                        </div>
                      </label>
                      <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                          if (file) {
                            if (file.size > 3 * 1024 * 1024) {
                              toast.error("File size must be less than 3MB");
                              field.onChange(undefined);
                              setPreview(null);
                              return;
                            }
                            const url = URL.createObjectURL(file);
                            setPreview(url);
                          } else {
                            setPreview(null);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-center" />
                </FormItem>
              )}
            />

            {/* Form Fields */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter username"
                        className="focus-visible:ring-primary"
                        defaultValue={user?.username}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        className="focus-visible:ring-primary"
                        defaultValue={user?.email}
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        className="focus-visible:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 pb-0 pt-6">
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
