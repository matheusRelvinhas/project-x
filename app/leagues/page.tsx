'use client';

import Icon from '@/components/icon';
import { useState, useEffect } from "react";
import Input from "@/components/input";
import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { axiosGet } from "@/utils/axios";
import { useAppContext } from "@/context/context";

export default function LeaguesPage() {

    return (
        <div className="flex h-full flex-col w-full fadeIn gap-1">
            <div className='flex transition border-default-400 border-b-1'>
                <span className='text-lg font-bold text-default-950'>Leagues</span>
            </div>
            <span className='flex transition text-default-800 text-sm'>Utilizando nossas estatísticas é possível analisar o desempenho das ligas ou campeonatos e chegar a conclusões através de diversas métricas.</span>
        </div>
    );
}
