export const BookingListByBuildingCodeAndResourceTypeQuery = `query BookingListByBuildingCodeAndResourceType($buidingCode: String, $resourceType: String)
  {
    data: Booking_Booking_detailList {
      building_id: Building_id
      building: BuildingViaBuilding_id(joinType: INNER where: { Code: { EQ: $buidingCode } }) {
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
      place_type: Resource_place_typeViaPlace_type_id(joinType: INNER where: { Code: { EQ: $resourceType } }) {
        code: Code
        name: Name
      }
    }
  }`;

  export const BookingListByBuildingCodeQuery = `query BookingListByBuildingCode($buildingCode: String)
    {
      data: Booking_Booking_detailList {
        building_id: Building_id
        building: BuildingViaBuilding_id(joinType: INNER where: { Code: { EQ: $buildingCode } }) {
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
