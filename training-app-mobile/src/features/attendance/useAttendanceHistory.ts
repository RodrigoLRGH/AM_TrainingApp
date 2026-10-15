import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getAttendanceCalendar, type AttendanceRecord } from '../../api/attendance';
import { getClients } from '../../api/clients';
import type { Client } from '../../api/types';

export type AttendanceSection = {
    title: string;
    data: AttendanceRecord[];
};

function pad(value: number) {
    return String(value).padStart(2, '0');
}

function dayKey(iso: string) {
    const date = new Date(iso);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dayTitle(iso: string) {
    return new Date(iso).toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
}

export function useAttendanceHistory() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [recordsData, clientsData] = await Promise.all([
                getAttendanceCalendar(selectedClientId ?? undefined),
                getClients(),
            ]);
            setRecords(recordsData);
            setClients(clientsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [selectedClientId]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    // El backend ya devuelve los registros del más reciente al más antiguo,
    // así que el Map conserva ese orden
    const sections = useMemo<AttendanceSection[]>(() => {
        const groups = new Map<string, AttendanceRecord[]>();

        for (const record of records) {
            const key = dayKey(record.date);
            const group = groups.get(key);
            if (group) {
                group.push(record);
            } else {
                groups.set(key, [record]);
            }
        }

        return Array.from(groups.values()).map((data) => ({
            title: dayTitle(data[0].date),
            data,
        }));
    }, [records]);

    return {
        sections,
        clients,
        selectedClientId,
        setSelectedClientId,
        loading,
    };
}