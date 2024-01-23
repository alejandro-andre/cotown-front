export const PROVIDERS_QUERY = `query ProviderList {
    data: Provider_ProviderList (
        orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
    ) {
        id,
        name: Name
    }
}`;

export const HOLIDAYS_QUERY = `query HolidayList {
    data: Auxiliar_HolidayList (
        orderBy: [{attribute: Day, direction:ASC, nullsGo: FIRST}]
    ) {
        day: Day
        location: Location_id
    }
}`;