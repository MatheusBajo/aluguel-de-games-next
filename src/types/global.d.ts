export {}; // mantém o arquivo como módulo

declare global {
    // eslint-disable-next-line no-var
    var sessionCleanupInterval: NodeJS.Timeout | undefined;
}
