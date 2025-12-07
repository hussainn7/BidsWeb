import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest to not throw error if no token
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's an error or no user, just return undefined (don't throw)
    // This allows the endpoint to work with or without authentication
    if (err || !user) {
      return undefined;
    }
    return user;
  }

  // Override canActivate to catch errors and allow request to proceed
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Try to authenticate, but catch errors (like missing token) and allow request
    const result = super.canActivate(context);
    
    // Handle Promise
    if (result instanceof Promise) {
      return result.catch(() => {
        // If authentication fails (e.g., no token), allow the request anyway
        return true;
      });
    }
    
    // Handle Observable
    if (result instanceof Observable) {
      return result.pipe(
        catchError(() => {
          // If authentication fails, allow the request anyway
          return of(true);
        })
      );
    }
    
    // Handle boolean (shouldn't happen, but just in case)
    return result;
  }
}

