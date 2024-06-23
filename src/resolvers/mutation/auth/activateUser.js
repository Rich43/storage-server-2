const activateUser = async (parent, { activationCode }, { knex }) => {
    try {
        const user = await knex('User')
            .where('activation_key', activationCode)
            .first();

        if (!user) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Invalid activation code');
        }

        await knex('User')
            .where('id', user.id)
            .update({
                activated: true,
                activation_key: null,
                updated: knex.fn.now()
            });

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default activateUser;
