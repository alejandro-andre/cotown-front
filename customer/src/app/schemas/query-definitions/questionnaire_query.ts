export const GET_QUESTIONNAIRE_BY_TYPE = `query q ($type: Auxiliar_QuestionnaireEnumType) {
  data: Booking_Booking_question_groupList (
      where: { Questionnaire_type: { EQ: $type } }
      orderBy: { attribute: Order }
  ) {
      name: Name
      description: Description
      description_en: Description_en
      questions: Booking_questionListViaGroup_id (
          orderBy: { attribute: Order }
      ) {
          question: Question
          question_en: Question_en
          type: Question_type
      }
  }
}`;