export const ProviderListQuery = `query ProviderList {
    data: Provider_ProviderList (
        orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
    ) {
        id,
        name: Name
    }
}`;