export const BookingListByBuildingIdAndResourceTypeQuery = `query BookingListByBuildingIdAndResourceType($buildingId: Int, $resourceTypeId: Int)
  {
    data: Booking_Booking_detailList (where: { Building_id: { EQ: $buildingId }, Place_type_id: { EQ: $resourceTypeId } }) {
      building_id: Building_id
      building: BuildingViaBuilding_id {
        code: Code,
      }
      booking_id: Booking_id
      booking: BookingViaBooking_id {
        customer: CustomerViaCustomer_id {
          last_name: Last_name
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
            last_name: Last_name
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
