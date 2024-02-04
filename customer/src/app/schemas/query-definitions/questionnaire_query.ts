export const GET_QUESTIONNAIRE_BY_TYPE = `query q ($type: Auxiliar_QuestionnaireEnumType) {
  data: Booking_Booking_question_groupList (
      where: { Questionnaire_type: { EQ: $type } }
      orderBy: { attribute: Order }
  ) {
      Name
      Description
      Description_en
      Booking_questionListViaGroup_id (
          orderBy: { attribute: Order }
      ) {
          Question
          Question_en
          Question_type
      }
  }
}`;

