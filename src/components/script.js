const getAllUserSubmissions = async (handle) => {
    // getALL Submissions , return error if error occurs or status is FAILED response.body.result is null
    // response.body.result is an array of objects of all the submissions of the user
    const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100000`);
    if (response.status === "FAILED") {
        return { error: response.comment }
    }
    const body = await response.json();
    if (body.status !== 'OK') {
        return { error: "Some error occured" }
    }
    if (body.result == null) {
        return { error: "Some error occured" }
    }
    console.log(handle, body.result)
    return body.result;
}

const filterSubmissions = (submissions, tags) => {
    // filter submissions based on tags
    const probs = submissions.filter((sub) => {
        let found = 1;
        for (let idx = 0; idx < tags.length; idx++) {
            if (!sub.problem.tags.find((val) => {
                return val === tags[idx]
            })) {
                found = 0;
                break;
            }
        }
        return found;
    })
    console.log(probs)
    return probs;
}

const filterFunc = (list) => {
    const solvedSet = new Set();
    const unsolvedSet = new Set();

    list.forEach(element => {
        if (element.verdict === 'OK') {
            solvedSet.add(JSON.stringify(element.problem))
        }
    })

    list.forEach(element => {
        // console.log("hell-",solvedSet.has(JSON.stringify(element.problem)))

        if (element.verdict !== 'OK' && !solvedSet.has(JSON.stringify(element.problem))) {
            unsolvedSet.add(JSON.stringify(element.problem))
        }
    })
    // console.log(unsolvedSet, "Unsolved Set");

    return {
        solved: solvedSet,
        unsolved: unsolvedSet
    }

}

// given 2 lists - listA, listB containing problem ids
// find all problems from listB which do not appear in listA
const getList = (listA, listB, friendSolved, friendNotSolved) => {
    const userSets = filterFunc(listA)
    const friendSets = filterFunc(listB)

    // console.log(solvedA)

    friendSets.solved.forEach((element) => {
        if (!userSets.solved.has(element)) {
            friendSolved.push(JSON.parse(element))
        }
    })

    friendSets.unsolved.forEach((element) => {
        if (!userSets.solved.has(element)) {
            friendNotSolved.push(JSON.parse(element))
        }
    })
}


export const getLists = async (handle, friendHandle, tags) => {
    const userSubmissions = await getAllUserSubmissions(handle);
    if (userSubmissions.error) {
        return { error: userSubmissions.error }
    }
    const friendSubmissions = await getAllUserSubmissions(friendHandle);
    if (friendSubmissions.error) {
        return { error: friendSubmissions.error }
    }
    const filteredUserSubmissions = await filterSubmissions(userSubmissions, tags);
    const filteredFriendSubmissions = await filterSubmissions(friendSubmissions, tags);
    const friendSolved = [];
    const friendNotSolved = [];

    getList(filteredUserSubmissions, filteredFriendSubmissions, friendSolved, friendNotSolved);
    return {
        friendSolved,
        friendNotSolved
    }
}

