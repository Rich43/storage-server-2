const activateUser = async (parent, { activationCode }, { db, model, utils, token }) => {
    try {
        const user = await model.User.findActivationKey(db, activationCode);

        if (!user) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Invalid activation code');
        }
        await model.User.updateActivationKey(db, utils, user.id);

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default activateUser;
