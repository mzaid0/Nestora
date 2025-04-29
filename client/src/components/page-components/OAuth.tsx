import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useMutation } from "@tanstack/react-query";
import { googleApi } from "@/api/auth";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { setUser } from "@/store/user/user-slice";
import { useNavigate } from "react-router-dom";
import { IApiError } from "@/types/api-error-type";
const OAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["google"],
    mutationFn: googleApi,
    onSuccess: (data) => {
      console.log(data.user);
      dispatch(setUser(data.user));
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

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const response = await signInWithPopup(auth, provider);

      const { displayName: name, email, photoURL: avatar } = response.user;
      mutate({ name, email, avatar });
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: (
          <span className="text-xs text-gray-600">
            Failed to sign in with Google
          </span>
        ),
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleClick}
      variant="outline"
      className="w-full mt-2"
      disabled={isPending}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      <FcGoogle />
      Continue with Google
    </Button>
  );
};

export default OAuth;
