export default async function checkForServerOptions(
    guildId: string
): Promise<boolean> {
    // Check if the server has the correct options set
    const serverOptions = await database.guildOptions.findFirst({
        where: {
            guildId
        }
    })

    if (!serverOptions) {
        return false
    }

    return true
}
