export const BookingListByBuildingIdAndResourceTypeQuery = `query BookingListByBuildingIdAndResourceType($buildingId: Int, $resourceTypeId: Int)
  {
    data: Booking_Booking_detailList (
      where: { Building_id: { EQ: $buildingId }, Place_type_id: { EQ: $resourceTypeId } }
    ) {
      building_id: Building_id
      building: BuildingViaBuilding_id {
        code: Code,
      }
      booking_id: Booking_id
      booking: BookingViaBooking_id {
        customer: CustomerViaCustomer_id {
          name: Name
          birth_date: Birth_date
          gender: GenderViaGender_id {
            code: Code
            name: Name
          }
          email: Email
          phones: Phones
          country: CountryViaCountry_id {
            name: Name
          }
        }
      }
      status: Status
      resource: ResourceViaResource_id{
        code: Code
      }
      date_from: Date_from
      date_to: Date_to
      lock: Lock
      flat_type: Resource_flat_typeViaFlat_type_id {
        code: Code
        name: Name,
        id
      }
      place_type: Resource_place_typeViaPlace_type_id {
        code: Code
        name: Name
      }
    }
  }`;

export const BookingListByBuildingIdAndResourceFlatTypeQuery = `query BookingListByBuildingIdAndResourceFlatTypeQuery($buildingId: Int, $resourceTypeFlatId: Int)
  {
    data: Booking_Booking_detailList (
      where: { Building_id: { EQ: $buildingId }, Flat_type_id: { EQ: $resourceTypeFlatId } }
    ) {
      building_id: Building_id
      building: BuildingViaBuilding_id {
        code: Code,
      }
      booking_id: Booking_id
      booking: BookingViaBooking_id {
        customer: CustomerViaCustomer_id {
          name: Name
          birth_date: Birth_date
          gender: GenderViaGender_id {
            code: Code
            name: Name
          }
          email: Email
          phones: Phones
          country: CountryViaCountry_id {
            name: Name
          }
        }
      }
      status: Status
      resource: ResourceViaResource_id{
        code: Code
      }
      date_from: Date_from
      date_to: Date_to
      lock: Lock
      flat_type: Resource_flat_typeViaFlat_type_id {
        code: Code
        name: Name,
        id
      }
      place_type: Resource_place_typeViaPlace_type_id {
        code: Code
        name: Name
      }
    }
  }`;

  export const BookingListByBuildingIdAndResourceAndFlatTypeQuery = `query BookingListByBuildingIdAndResourceAndFlatType($buildingId: Int, $resourceTypeId: Int, $resourceTypeFlatId: Int)
  {
    data: Booking_Booking_detailList (
      where: { Building_id: { EQ: $buildingId }, Place_type_id: { EQ: $resourceTypeId }, Flat_type_id: { EQ: $resourceTypeFlatId } }
    ) {
      building_id: Building_id
      building: BuildingViaBuilding_id {
        code: Code,
      }
      booking_id: Booking_id
      booking: BookingViaBooking_id {
        customer: CustomerViaCustomer_id {
          name: Name
          birth_date: Birth_date
          gender: GenderViaGender_id {
            code: Code
            name: Name
          }
          email: Email
          phones: Phones
          country: CountryViaCountry_id {
            name: Name
          }
        }
      }
      status: Status
      resource: ResourceViaResource_id{
        code: Code
      }
      date_from: Date_from
      date_to: Date_to
      lock: Lock
      flat_type: Resource_flat_typeViaFlat_type_id {
        code: Code
        name: Name,
        id
      }
      place_type: Resource_place_typeViaPlace_type_id {
        code: Code
        name: Name
      }
    }
  }`;

  export const BookingListByResourceTypeQuery = `query BookingListByResourceType($resourceTypeId: Int)
  {
    data: Booking_Booking_detailList (
      where: {Place_type_id: { EQ: $resourceTypeId } }
    ) {
      building_id: Building_id
      building: BuildingViaBuilding_id {
        code: Code,
      }
      booking_id: Booking_id
      booking: BookingViaBooking_id {
        customer: CustomerViaCustomer_id {
          name: Name
          birth_date: Birth_date
          gender: GenderViaGender_id {
            code: Code
            name: Name
          }
          email: Email
          phones: Phones
          country: CountryViaCountry_id {
            name: Name
          }
        }
      }
      status: Status
      resource: ResourceViaResource_id{
        code: Code
      }
      date_from: Date_from
      date_to: Date_to
      lock: Lock
      flat_type: Resource_flat_typeViaFlat_type_id {
        code: Code
        name: Name
      }
      place_type: Resource_place_typeViaPlace_type_id {
        code: Code
        name: Name
      }
    }
  }`;

  export const BookingListByResourceTypeAndFlatQuery = `query BookingListByResourceTypeAndFlat($resourceTypeId: Int, $resourceTypeFlatId: Int)
  {
    data: Booking_Booking_detailList (
      where: { Place_type_id: { EQ: $resourceTypeId },  Flat_type_id: { EQ: $resourceTypeFlatId } }
    ) {
      building_id: Building_id
      building: BuildingViaBuilding_id {
        code: Code,
      }
      booking_id: Booking_id
      booking: BookingViaBooking_id {
        customer: CustomerViaCustomer_id {
          name: Name
          birth_date: Birth_date
          gender: GenderViaGender_id {
            code: Code
            name: Name
          }
          email: Email
          phones: Phones
          country: CountryViaCountry_id {
            name: Name
          }
        }
      }
      status: Status
      resource: ResourceViaResource_id{
        code: Code
      }
      date_from: Date_from
      date_to: Date_to
      lock: Lock
      flat_type: Resource_flat_typeViaFlat_type_id {
        code: Code
        name: Name
      }
      place_type: Resource_place_typeViaPlace_type_id {
        code: Code
        name: Name
      }
    }
  }`;


  export const BookingListByResourceTypeFlatQuery = `query BookingListByResourceTypeFlat($resourceTypeFlatId: Int)
  {
    data: Booking_Booking_detailList (
      where: { Flat_type_id: { EQ: $resourceTypeFlatId } }
    ) {
      building_id: Building_id
      building: BuildingViaBuilding_id {
        code: Code,
      }
      booking_id: Booking_id
      booking: BookingViaBooking_id {
        customer: CustomerViaCustomer_id {
          name: Name
          birth_date: Birth_date
          gender: GenderViaGender_id {
            code: Code
            name: Name
          }
          email: Email
          phones: Phones
          country: CountryViaCountry_id {
            name: Name
          }
        }
      }
      status: Status
      resource: ResourceViaResource_id{
        code: Code
      }
      date_from: Date_from
      date_to: Date_to
      lock: Lock
      flat_type: Resource_flat_typeViaFlat_type_id {
        code: Code
        name: Name,
        id
      }
      place_type: Resource_place_typeViaPlace_type_id {
        code: Code
        name: Name
      },
    }
  }`;

export const BookingListByBuildingIdQuery = `query BookingListByBuildingId($buildingId: Int)
    {
      data: Booking_Booking_detailList( where: { Building_id: { EQ: $buildingId } }) {
        building_id: Building_id
        building: BuildingViaBuilding_id {
          code: Code,
        }
        booking_id: Booking_id
        booking: BookingViaBooking_id {
          customer: CustomerViaCustomer_id {
            name: Name
            birth_date: Birth_date
            gender: GenderViaGender_id {
              code: Code
              name: Name
            }
            email: Email
            phones: Phones
            country: CountryViaCountry_id {
              name: Name
            }
          }
        }
        status: Status
        resource: ResourceViaResource_id{
          code: Code
        }
        date_from: Date_from
        date_to: Date_to
        lock: Lock
        flat_type: Resource_flat_typeViaFlat_type_id {
          code: Code
          name: Name,
          id
        }
        place_type: Resource_place_typeViaPlace_type_id {
          code: Code
          name: Name
        }
      }
    }`;

    export const BookingList = `query BookingList
    {
      data: Booking_Booking_detailList {
        building_id: Building_id
        building: BuildingViaBuilding_id {
          code: Code,
        }
        booking_id: Booking_id
        booking: BookingViaBooking_id {
          customer: CustomerViaCustomer_id {
            name: Name
            birth_date: Birth_date
            gender: GenderViaGender_id {
              code: Code
              name: Name
            }
            email: Email
            phones: Phones
            country: CountryViaCountry_id {
              name: Name
            }
          }
        }
        status: Status
        resource: ResourceViaResource_id{
          code: Code
        }
        date_from: Date_from
        date_to: Date_to
        lock: Lock
        flat_type: Resource_flat_typeViaFlat_type_id {
          code: Code
          name: Name,
          id
        }
        place_type: Resource_place_typeViaPlace_type_id {
          code: Code
          name: Name
        }
      }
    }`;

export const getBuildingDataWithBooking = `query bookingQuery($id: Int)
{
  bookings: Booking_BookingList(where:{ id: { EQ: $id } }) {
    building_id: Building_id
    booking_id: id
    date_from: Date_from
    date_to: Date_to
    lock: Lock
 }
}`;
