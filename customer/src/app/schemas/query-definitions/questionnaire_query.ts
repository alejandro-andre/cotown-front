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
          id
          question: Question
          question_en: Question_en
          type: Question_type
      }
  }
}`;

export const INSERT_QUESTIONNAIRE_PHOTO = `mutation ($questionnaireId: Int! $image: Models_DocumentTypeInputType $comments: String) {
  data: Booking_Booking_photoCreate(
    entity: {
      Questionnaire_id: $questionnaireId
      Image: $image
      Comments: $comments
    }
  ) {
    id
    Questionnaire_id
    Comments
    Image {
      oid
      name
      thumbnail
      type
    }
  }
}
`;