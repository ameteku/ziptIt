type Base= {
    title : string,
    id?: string,
    description : string
};


type Class =  Base & {
    relatedTopicIds : string[]
};

type Topic  = Base & {
    classId: string,
    linkIds: string[]
};

type Ratings = {
    ratings : number[]
};

type Link = Base & {
    classId: string,
    topicId: string,
    actualLink : string,
    ratings : Ratings
};