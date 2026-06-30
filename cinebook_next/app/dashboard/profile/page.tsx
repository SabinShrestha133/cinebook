"use client";

import { useForm } from "react-hook-form";
import { profileSchema, type ProfileFormData } from "@/app/frontend/_components/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { handleWhoami, handleUpdateUser } from "@/lib/actions/auth-action";
import { Camera, Loader2, Save } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

interface UserData {
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
    phoneNumber?: string;
    profilePicture?: string;
}

export default function ProfilePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fetching, setFetching] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        const fetchUser = async () => {
            setFetching(true);
            const result = await handleWhoami();
            if (result.success && result.data) {
                const rawData = result.data as Record<string, unknown>;
                const userData: UserData = (rawData.data as Record<string, unknown>)?.user as UserData ?? (rawData.user as UserData) ?? rawData as UserData;
                reset({
                    name: userData?.name ?? userData?.username ?? "",
                    email: userData?.email ?? "",
                    phone: userData?.phoneNumber ?? userData?.phone ?? "",
                    profileImage: undefined,
                });
                if (userData?.profilePicture) {
                    setImagePreview(userData.profilePicture);
                }
            }
            setFetching(false);
        };
        fetchUser();
    }, [reset]);

    const onSubmit = useCallback(async (data: ProfileFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            if (data.name) formData.append("name", data.name);
            if (data.email) formData.append("email", data.email);
            if (data.phone) formData.append("phoneNumber", data.phone);
            if (data.profileImage && data.profileImage instanceof File) {
                formData.append("profileImage", data.profileImage);
            }

            const result = await handleUpdateUser(formData);
            if (result.success) {
                toast.success("Profile updated successfully");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to update profile");
            } else {
                toast.error("Failed to update profile");
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            toast.error("Invalid image type. Use JPEG, PNG, WebP, or GIF.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-wide">Update Profile</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your personal information</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 sm:p-8">
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-24 h-24 rounded-full bg-[#222] border-2 border-white/10 overflow-hidden flex items-center justify-center">
                                {imagePreview ? (
                                    <Image 
                                        src={imagePreview} 
                                        alt="Profile" 
                                        fill 
                                        className="object-cover" 
                                    />
                                ) : (
                                    <Camera className="w-8 h-8 text-gray-600" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-yellow-400 text-black p-1.5 rounded-full hover:bg-yellow-300 transition z-10"
                                >
                                    <Camera className="w-3.5 h-3.5" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <p className="text-gray-500 text-xs mt-3">JPG, PNG, WebP. Max 2MB.</p>
                        </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">
                                Name
                            </label>
                            <input
                                type="text"
                                {...register("name")}
                                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                            />
                            {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">
                                Email Address
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                            />
                            {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">
                                Phone
                            </label>
                            <input
                                type="tel"
                                {...register("phone")}
                                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                            />
                            {errors.phone && <span className="text-red-400 text-xs mt-1 block">{errors.phone.message}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 px-8 rounded-lg tracking-widest uppercase transition shadow-lg shadow-yellow-400/10 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
