import { useMutation } from "@tanstack/react-query";
import { adminLogin } from "@/infrastructure/api/auth.api";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: adminLogin,

    onSuccess: (res) => {
      if (!res.success) throw new Error(res.message);

      // 👉 DO NOT store tokens
      // backend already set cookies

      router.push("/dashboard");
    },
  });
};