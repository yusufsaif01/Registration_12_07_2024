async createPassword(tokenData, new_password, confirmPassword) {
        try {
            await this.validateCreatePassword(tokenData, new_password, confirmPassword);
            let loginDetails = await this.loginUtilityInst.findOne({ user_id: tokenData.user_id })
            if (loginDetails) {
                if (!loginDetails.is_email_verified) {
                    return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.EMAIL_NOT_VERIFIED));
                }
                if (!loginDetails.forgot_password_token) {
                    return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.PASSWORD_ALREADY_CREATED));
                }
                const password = await this.authUtilityInst.bcryptToken(new_password);
                await this.loginUtilityInst.updateOne({ user_id: loginDetails.user_id }, {
                    password: password,
                    forgot_password_token: "",
                    "profile_status.status": ProfileStatus.VERIFIED 

                });
                await redisServiceInst.deleteByKey(`keyForForgotPassword${tokenData.forgot_password_token}`);
                let playerName = '';
                if (loginDetails.role == ROLE.PLAYER) {
                    let userDetails = await this.utilityService.getPlayerDetails(
                      loginDetails.user_id
                    );
                    if (userDetails) {
                        playerName = userDetails.first_name;
                    }
                } else {
                    let clubAcademyDetails = await this.utilityService.getClubDetails(
                      loginDetails.user_id
                    );
                    if (clubAcademyDetails) {
                      playerName = clubAcademyDetails.name;
                    }
                }

                await this.emailService.welcome(loginDetails.username);
                await this.emailService.postEmailConfirmation({
                    email : loginDetails.username,
                    name: playerName,
                });
                return Promise.resolve();
            }
            throw new errors.Unauthorized(RESPONSE_MESSAGE.USER_NOT_REGISTERED);
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }
