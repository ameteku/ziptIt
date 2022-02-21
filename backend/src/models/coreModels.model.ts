type Base= {
    title : string,
    id: string,
    description : string
};


type Class =  Base & {
    relatedTopicIds : string[]
};

type Topic  = Base & {
    linkIds : string[]
};

type Ratings = {
    linkId :string,
    ratingId : string,
    ratings : number[]
};

type Link = Base & {
    classId: string,
    topicId: string,
    actualLink : string,
    ratingObjectId : string
};