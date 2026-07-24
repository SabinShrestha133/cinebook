"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const ALL_GENRES = [
    "action",
    "adventure",
    "comedy",
    "drama",
    "fantasy",
    "horror",
    "musicals",
    "mystery",
    "romance",
    "science fiction",
    "sports",
    "thriller",
    "Western",
];

type GenreModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedGenres: string[];
    onSelect: (genres: string[]) => void;
};

export default function GenreModal({ isOpen, onClose, selectedGenres, onSelect }: GenreModalProps) {
    const [temp, setTemp] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setTemp([...selectedGenres]);
        }
    }, [isOpen, selectedGenres]);

    if (!isOpen) return null;

    const toggle = (genre: string) => {
        setTemp((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };

    const handleSave = () => {
        onSelect(temp);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-white text-lg font-bold uppercase tracking-widest">Select Genres</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
                    {ALL_GENRES.map((genre) => {
                        const active = temp.includes(genre);
                        return (
                            <button
                                key={genre}
                                type="button"
                                onClick={() => toggle(genre)}
                                className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-widest transition ${
                                    active
                                        ? "bg-yellow-400 text-black border-yellow-400"
                                        : "bg-[#111] text-gray-300 border-white/10 hover:border-yellow-400/50"
                                }`}
                            >
                                {genre}
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-3 p-6 border-t border-white/5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold py-3 rounded-lg uppercase tracking-widest transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold py-3 rounded-lg uppercase tracking-widest transition"
                    >
                        Save Genres
                    </button>
                </div>
            </div>
        </div>
    );
}
