import { useMutation } from "@tanstack/react-query";
import { adminLoginStart } from "@/infrastructure/api/auth.api";
import { useRouter } from "next/navigation";

export const useAdminLoginStart = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: adminLoginStart,

    onSuccess: (res) => {
      const challengeId = res.challengeId || res.data?.challengeId;
      const target = res.target || res.data?.target;

      if (challengeId) {
        sessionStorage.setItem(
          "admin_challenge",
          JSON.stringify({ challengeId, target })
        );
        router.push("/verify-otp");
      }
    },
  });
};