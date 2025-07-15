// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

interface ShortcutHandlers {
    onSave?: () => void;
    onNew?: () => void;
    onSearch?: () => void;
    onDelete?: () => void;
    onEscape?: () => void;
}

export function useKeyboardShortcuts({
                                         onSave,
                                         onNew,
                                         onSearch,
                                         onDelete,
                                         onEscape
                                     }: ShortcutHandlers) {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ctrl/Cmd + S - Salvar
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                onSave?.();
            }

            // Ctrl/Cmd + N - Novo
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                onNew?.();
            }

            // Ctrl/Cmd + F - Buscar
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                onSearch?.();
            }

            // Delete - Excluir (quando item selecionado)
            if (e.key === 'Delete' && !e.ctrlKey && !e.metaKey) {
                onDelete?.();
            }

            // Escape - Fechar modais
            if (e.key === 'Escape') {
                onEscape?.();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [onSave, onNew, onSearch, onDelete, onEscape]);
}