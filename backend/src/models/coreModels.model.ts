type Base= {
    title : string,
    id: string,
    description : string
};


type Class =  Base & {
    relatedTopicIds : Array<string>
};

type Topic  = Base & {
    linkIds : Array<string>
};

type Ratings = {
    linkId :string,
    ratingId : string,
    ratings : Array<number>
};

type Link = Base & {
    classId: string,
    topicId: string,
    actualLink : string,
    ratingObjectId : string
};