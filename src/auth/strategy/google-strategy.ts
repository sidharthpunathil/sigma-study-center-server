import { Inject, Injectable } from "@nestjs/common";
import { Strategy, Profile } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService, readonly configService: ConfigService
    ) {
        super(
            {
                // clientID: '314440402383-skra4tkbcr8npdcvm5m3qbv5mv217lc8.apps.googleusercontent.com',
                // clientSecret: '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' ,
                // callbackURL: 'http://localhost:3000/api/v1/auth/google/redirect',
                clientID: configService.get<string>('Google.clientId'),
                clientSecret: configService.get<string>('Google.clientSecret'),
                callbackURL: configService.get<string>('Google.callbackURL'),
                scope: ['profile', 'email'],
            }
        )
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        const user = await this.authService.validateUser({
          email: profile.emails[0].value,
          displayName: profile.displayName,
        });
        console.log('Validate');
        console.log(user);
        return user || null;
      }
}