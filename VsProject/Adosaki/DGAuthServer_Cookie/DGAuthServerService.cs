
using DGAuthServer.Models;
using DGAuthServer.ModelsDB;
using DGAuthServer_Cookie;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace DGAuthServer;


/// <summary>
/// ��ū ó���� ���� ����
/// </summary>
public class DGAuthServerService
{

	/// <summary>
	/// ������ ��ū ����
	/// </summary>
	/// <remarks>
	/// ClassCookieOnly�� ������̸� sClass�� ���õǰ� ��Ű�� �о� ����Ѵ�.
	/// </remarks>
	/// <param name="idUser">���� ������ ���� ���� ��ȣ</param>
	/// <param name="bAccessTokenLifetimeUse">AccessTokenLifetime ������� ����. 
	/// ������� ������  ��Ű�� �����ð��� 1�� �����ȴ�.</param>
	/// <param name="bRefreshTokenNew">���÷��� ��ū ������ ���λ������� ����<br />
	/// �α��ΰ� ���� ��Ȳ������ ������ ���� �������ش�.(�α��ν� ���÷��� ��ū�� ���� �����ϴ°��� ��Ģ�̴�.)</param>
	/// <param name="request"></param>
	/// <param name="response">�߰� ó���� ���� ��������</param>
	/// <param name="sRefreshToken">�ɼǿ� ���� ���÷��� ��ū�� ������ǰų� �������ִ� �������� ��ū�� ���޵ȴ�.</param>
	/// <returns></returns>
	public string AccessTokenGenerate(
        long idUser
		, bool bAccessTokenLifetimeUse
        , bool bRefreshTokenNew
		, HttpRequest request
		, HttpResponse response
        , out string sRefreshToken)
    {

        //Ŭ���� �̸� ����
		string sClassFinal = this.CookieGet_Class(request);


		//��ũ�� Ű �ӽ� ����
		string sSecret = string.Empty;
        
        if (true == DGAuthServerGlobal.Setting.SecretAlone)
        {//ȥ�ڻ���ϴ� ��ũ��

            DgAuthAccessToken? findAT = null;

            using (DgAuthDbContext db1 = new DgAuthDbContext())
            {
                findAT 
                    = db1.DGAuthServer_AccessToken
                        .Where(w => w.idUser == idUser
                                && w.Class == sClassFinal)
                        .FirstOrDefault();

                if (null != findAT)
                {//����ϴ� ��ũ���� �ִ�.

                    //����
                    sSecret = findAT.Secret;
                }
                else
                {//����ϴ� ��ũ���� ����.
                    DgAuthAccessToken newAT = new DgAuthAccessToken();
                    //����� �Է�
                    newAT.idUser = idUser;
                    newAT.Class = sClassFinal;
                    //���ο� ��ũ���� �����Ѵ�.
                    sSecret = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
                    newAT.Secret = sSecret;

                    //db�� ����
                    db1.Add(newAT);
                    db1.SaveChanges();

                    if (true == DGAuthServerGlobal.Setting.MemoryCacheIs)
                    {//�޸� ĳ���� ����

                        this.MemoryCacheSaveSecret(idUser, sSecret);
                    }
                }
            }//end using db1
        }
        else
        {
            //���� ��ũ���� ����.
            sSecret = DGAuthServerGlobal.Setting.Secret!;
        }

        //��ũ���� ����Ʈ �迭�� ��ȯ
        byte[] byteSecretKey = new byte[0];
        byteSecretKey = Encoding.ASCII.GetBytes(sSecret);


        //jwt ���� ��ū �ڵ鷯
        JwtSecurityTokenHandler tokenHandler 
            = new JwtSecurityTokenHandler();

        //������Ű ������ �ʿ��� ������ �Է��Ѵ�.
        SecurityTokenDescriptor tokenDescriptor 
            = new SecurityTokenDescriptor
            {
                //�߰��� ���� ����(Ŭ����)
                Subject = new ClaimsIdentity(
                            new[] { new Claim(DGAuthServerGlobal.Setting.UserIdName
                                            , idUser.ToString()) }),
                //��ȿ�Ⱓ
                Expires = DateTime.UtcNow.AddSeconds(DGAuthServerGlobal.Setting.AccessTokenLifetime),
                //��ȣȭ ���
                SigningCredentials 
                    = new SigningCredentials(new SymmetricSecurityKey(byteSecretKey)
                                                , SecurityAlgorithms.HmacSha256Signature)
            };

        //��ū ����
        SecurityToken token 
            = tokenHandler.CreateToken(tokenDescriptor);

        //����ȭ
        StringBuilder sbToken = new StringBuilder();
        if (true == DGAuthServerGlobal.Setting.SecretAlone)
        {//ȥ �ڻ���ϴ� ��ũ��

            //�Ǿտ� ���� ������ȣ�� �ٿ��ش�.
            sbToken.Append(idUser);
            //���� ��ȣ
            sbToken.Append(DGAuthServerCookieGlobal.Setting.SecretAloneDelimeter);
        }

        //������� ��ū �߰�
        sbToken.Append(tokenHandler.WriteToken(token));



		//������ ��ū�� �����Ѵ�.
		this.Cookie_AccessToken(sbToken.ToString(), bAccessTokenLifetimeUse, response);

		//���÷�����ū ���������
		if (true == DGAuthServerGlobal.Setting.AccessTokenGenerateAndRefreshTokenGenerate
            || true == bRefreshTokenNew)
        {
			sRefreshToken 
                = this.RefreshTokenGenerate(
                    null
                    , idUser
                    , false
                    , request
                    , response);
		}
        else
        {

            //�������ִ� ���÷��� ��ū�� �����Ѵ�.
            using (DgAuthDbContext db1 = new DgAuthDbContext())
            {
                DgAuthRefreshToken? findRT
                    = db1.DGAuthServer_RefreshToken
                        .Where(w => w.idUser == idUser
                        && w.Class == sClassFinal)
                        .FirstOrDefault();

                //������� �Դµ� ���÷��� ��ū�� null���� ����.
                //���� null��� ������ ã�ƾ� �Ѵ�.

                if (null != findRT)
                {
                    sRefreshToken = findRT.RefreshToken;
				}
                else
                {
					sRefreshToken = string.Empty;
				}
			}
				
        }

        return sbToken.ToString();
    }

	/// <summary>
	/// ������ ��ū Ȯ��.
	/// </summary>
	/// <remarks>
	/// �̵������� ȣ���ؼ� ����Ѵ�.
	/// </remarks>
	/// <param name="request"></param>
	/// <returns>ã�Ƴ� idUser, ��ū ��ü�� ������ -1, ��ū�� ��ȿ���� ������ 0 </returns>
	public long AccessTokenValidate(
        HttpRequest request)
    {
        string sTokenFinal = String.Empty;

		string? sTokenTemp
				= request.Cookies[DGAuthServerCookieGlobal.Setting.AccessTokenCookieName];
		if (null != sTokenTemp)
		{//�˻��� ���� ������ ����
			sTokenFinal = sTokenTemp.ToString();
		}


		if (string.Empty == sTokenFinal)
        {//���޵� ��ū ���� ����.
            return -1;
        }


        //���� ���� ��ū���� ��ū ������ ����� ������
        string sTokenCut = string.Empty;
        //ã�Ƴ� ���� ��ȣ
        long idUser = 0;
        //��ũ�� Ű �ӽ� ����
        string sSecret = string.Empty;

        //����� ��ũ�� Ű ã��
        if (true == DGAuthServerGlobal.Setting.SecretAlone)
		{//ȥ�ڻ���ϴ� ��ũ��

            //ù��° �����ڸ� ã�´�.
            int nUser = sTokenFinal.IndexOf(DGAuthServerGlobal.Setting.SecretAloneDelimeter);

            if (0 > nUser)
            {//������ ��ū�� ���� ��ȣ�� ����.
                return 0;
            }


            //ã�� ������ ��ġ�� ���� ���̵� �ڸ���.
            string sCutUser = sTokenFinal.Substring(0, nUser);

			if (false == Int64.TryParse(sCutUser, out idUser))
			{//���ڷ� ��ȯ�� �� ����.
				return 0;
			}
			else if (0 >= idUser)
			{//���� ������ ����.
                
                //���� ������ �߸� �Ǿ���.
				return 0;
			}

            //�߸� �����Ϳ��� ��ū ������ ����
            //������ ������ġ = ã�� ������ ��ġ + ������ ũ��
            sTokenCut = sTokenFinal.Substring(
                            nUser + DGAuthServerGlobal.Setting.SecretAloneDelimeter.Length);


			//��Ű���� ��ū ������ �޾ƿ�
			string sClass
				= DGAuthServerCookieGlobal.Service.CookieGet_Class(request);


			if (true == DGAuthServerGlobal.Setting.MemoryCacheIs
                && true == this.MemoryCacheFindSecret(idUser, out sSecret))
            {//�޸� ĳ���� ������̰�
                //�޸� ĳ������ ���� ã�Ҵ�.

                //�̹� sSecret�� �����Ͱ� ������ ó������ �ʴ´�.
            }
            else
            {
                //����� ��ũ�� �˻�
                using (DgAuthDbContext db1 = new DgAuthDbContext())
                {
                    DgAuthAccessToken? findAT
                        = db1.DGAuthServer_AccessToken
                            .Where(w => w.idUser == idUser
                                    && w.Class == sClass)
                            .FirstOrDefault();

                    if (null != findAT)
                    {//������ ��ū�� ã�Ҵ�.

                        //ã�� ��ũ�� ����
                        sSecret = findAT.Secret;

                        if (true == DGAuthServerGlobal.Setting.MemoryCacheIs)
                        {
                            //�޸� ĳ���� �����Ѵ�.
                            this.MemoryCacheSaveSecret(idUser, sSecret);
                        }
                    }
                }//end using db1
            }

            

            if (null == sSecret
                || string.Empty == sSecret)
            {//��ũ�� ������ ����.
                return 0;
            }
        }
		else
		{
			sTokenCut = sTokenFinal;
            sSecret = DGAuthServerGlobal.Setting.Secret!;
        }


        //���� �м� ���� ****************
		JwtSecurityTokenHandler tokenHandler 
            = new JwtSecurityTokenHandler();
        //���� ��ũ���� ����Ʈ �迭�� ��ȯ
        byte[] byteKey 
            = Encoding.ASCII.GetBytes(sSecret);
        try
        {
            //��ū �ؼ��� �����Ѵ�.
            tokenHandler.ValidateToken(sTokenCut, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(byteKey),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            JwtSecurityToken jwtToken = (JwtSecurityToken)validatedToken;
            //ã�� ũ���ӿ��� ���� ������ȣ�� �����Ѵ�.
            long accountId 
                = Int64.Parse(jwtToken.Claims
                                .First(x => x.Type == DGAuthServerGlobal.Setting.UserIdName)
                                .Value);

            //ã�� ���̵�
            return accountId;
        }
        catch
        {//��ū�� �ؼ����� ���ߴ�.
            
            //��ū�� ����������� �ؼ����� ���ϸ� 0 ������ ��������
            //��Ȳ�� ���� ���÷��� ��ū���� ��ū�� �����ϵ��� �˷��� �Ѵ�.
            return 0;
        }
    }

	/// <summary>
	/// ������ ��ū�� �����Ŵ
	/// </summary>
	/// <remarks>
	/// ������ ��ū�� �����ų ����� ����<br />
	/// ���� ��ũ�� Ű�� ������϶��� ����ũ�� �����ϴ�.<br />
	/// ��Ű�� ������̶�� ��Ű�� �����ִ� ����� �Ѵ�.<br />
	/// bAllRevoke�� true��� ���� ��ũ�� Ű�� ��߱� �Ǹ鼭 
	/// ���� ��������ū�� ����� �� ���� �ȴ�.
	/// <para>
	/// ���� ����Ʈ(Ȥ�� ���α׷�)���� �ϳ��� ���������� �ΰ� ����Ұ�� 
	/// idUser�� ��ġ�� �ٸ� ����Ʈ������ ��������ū�� ����ǰ� �ȴ�.
	/// </para>
	/// </remarks>
	/// 
	/// <param name="bAllRevoke">Ŭ������ ������� ��ü ������ ��ū�� ����ũ�Ѵ�.<br />
	/// ���� ��ũ���� ������̶�� false�϶��� ���� ��ũ���� ������ �ʴ´�.
	/// </param>
	/// <param name="idUser"></param>
	/// <param name="request"></param>
	/// <param name="response"></param>
	/// <returns></returns>
	public void AccessTokenRevoke(
        bool bAllRevoke
        , long idUser
		, HttpRequest request
		, HttpResponse response)
    {
        using (DgAuthDbContext db1 = new DgAuthDbContext())
        {
            //��ū ����
            string sClassFinal = this.CookieGet_Class(request);

			IQueryable<DgAuthAccessToken> iqFindAT;

            if (true == bAllRevoke)
            {//��ü �˻�
                iqFindAT
                    = db1.DGAuthServer_AccessToken
                        .Where(w => w.idUser == idUser);
            }
            else
            {//��� �˻�
                iqFindAT
                    = db1.DGAuthServer_AccessToken
                        .Where(w => w.idUser == idUser
                                && w.Class == sClassFinal);
            }

            //����� ������ �����.
            //���� ��ũ���� ������̶�� ��������ū�� ��û�ϸ鼭 �ٽ� �����ȴ�.
            //�׷��� ���⼭�� ����⸸ �ϸ�ȴ�.
            db1.DGAuthServer_AccessToken.RemoveRange(iqFindAT);

            db1.SaveChanges();
        }//end using db1


        if (null != response)
        {//��Ű ���

            //���÷��� ��ū�� �����Ѵ�.
            this.Cookie_AccessToken(string.Empty, false, response);
        }
    }


	/// <summary>
	/// ���÷��� ��ū ����.
	/// </summary>
	/// <remarks>�ߺ��˻� �� ��ȿ���˻縦 �ϰ��� ���ǿ� �´� ��ū�� ����(����)�Ѵ�.</remarks>
	/// <param name="typeUsage"></param>
	/// <param name="idUser">�� ��ū�� ������ ������ ������ȣ</param>
	/// <param name="sClass">�� ��ū�� �з��ϱ� ���� �̸�</param>
	/// <param name="bRefreshTokenLifetimeUse">RefreshTokenLifetime�� ������� ����. 
	/// ������� ������ �����ð��� 1���� �����ȴ�.
	/// ��, 'AutoSigninCookieIs'�ɼ��� ������̸� �켱������ �ڷ� �и���.</param>
	/// <param name="request"></param>
	/// <param name="response">�߰� ó���� ���� ��������</param>
	/// <returns></returns>
	public string RefreshTokenGenerate(
        RefreshTokenUsageType? typeUsage
        , long idUser
		, bool bRefreshTokenLifetimeUse
		, HttpRequest request
		, HttpResponse response)
    {
        string sReturn = string.Empty;

        //��ū ����
		string sClassFinal = string.Empty;

		//���� �ð�
		DateTime dtNow = DateTime.Now;

        RefreshTokenUsageType typeNewTokenFinal = RefreshTokenUsageType.None;
        if (null != typeUsage)
        {//���޵� �ɼ��� �ִ�.
            typeNewTokenFinal = (RefreshTokenUsageType)typeUsage;
        }
        else
        {
            //������ ������ �о� ����Ѵ�.
            typeNewTokenFinal
                = DGAuthServerGlobal.Setting.RefreshTokenReUseType;
        }

        //��Ȳ�� �´� ��Ű ����
        sClassFinal = this.CookieGet_Class(request);




		if (string.Empty == sClassFinal
            && true == DGAuthServerCookieGlobal.Setting.ClassCookieAutoGenerate)
		{//sClassFinal���µ�
         //ClassCookieAutoGenerate�� ������̴�.

            //���ο� ��ū �з��� �������ش�.
            sClassFinal
                = Convert.ToHexString(RandomNumberGenerator.GetBytes(16));

            //���� ��û
            this.Cookie_Class(sClassFinal, response!);
		}


		using (DgAuthDbContext db1 = new DgAuthDbContext())
        {
            bool bNew = false;


            switch (typeNewTokenFinal)
            {
                case RefreshTokenUsageType.OneTimeOnly:
                    {
                        //���� ��ū�� ����
                        bNew = true;
                    }
                    break;

                case RefreshTokenUsageType.OneTimeOnlyDelay:
                case RefreshTokenUsageType.ReUse:
                case RefreshTokenUsageType.ReUseAddTime:
                    {
                        //���� ��ū�� �ִ��� ã�´�.
                        DgAuthRefreshToken? findRT
                            = db1.DGAuthServer_RefreshToken
                                .Where(w => w.idUser == idUser
                                        && w.Class == sClassFinal)
                                .FirstOrDefault();

                        if (null != findRT)
                        {//���� ��ū�� �ִ�.

                            //��ȿ���� ���� ��ġ��
                            findRT.ActiveCheck();

                            if (true == findRT.ActiveIs)
                            {//��ū�� ��ȿ�ϴ�.

                                //����ϴ� ��ū ����
                                sReturn = findRT.RefreshToken;

                                if (RefreshTokenUsageType.ReUseAddTime == typeNewTokenFinal)
                                {
                                    //���� �ð��� �÷��ش�.
                                    findRT.ExpiresTime
                                        = DateTime.UtcNow
                                            .AddSeconds(DGAuthServerGlobal.Setting
                                                            .RefreshTokenLifetime);

									//���� ��ū ���
									bNew = false;
								}
                                else if (RefreshTokenUsageType.OneTimeOnlyDelay == typeNewTokenFinal)
                                {

                                    //���� ��ū�� ������¥�� Ȯ���Ѵ�.
                                    if (findRT.GenerateTime.AddSeconds(DGAuthServerGlobal.Setting.OneTimeOnlyDelayTime)
                                         < dtNow)
                                    {//�����ð� + ������ �ð� ���� ���� �ð��� ���Ĵ�

                                        //���� ��ū�� ����
                                        bNew = true;
                                    }
                                    else
                                    {//�ƴϸ�
                                     
                                        //���� ��ū ���
                                        bNew = false;
                                    }   
                                }
                            }
                            else
                            {//��ū�� ���� �ƴ�.

                                //���� ��ū�� ����
                                bNew = true;
                            }   
                        }
                        else
                        {//���� ��ū�� ����.

                            //���� ��ū�� ����
                            bNew = true;
                        }
                    }
                    break;

                case RefreshTokenUsageType.None:
                default:
                    break;
            }

            if (true == bNew)
            {//��ū�� ���� �����ؾ� �Ѵ�.

                while (true)
                {
                    sReturn = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
                    if (false == this.RefreshTokenGenerate_OverflowCheck(sReturn))
                    {//�ߺ����� �ʾҴ�.
                        break;
                    }
                }


                //���̺� �����Ѵ�.
                DgAuthRefreshToken newRT = new DgAuthRefreshToken()
                {
                    idUser = idUser,
                    Class = sClassFinal,
                    RefreshToken = sReturn,
                    GenerateTime = dtNow,
                    ExpiresTime
                        = DateTime.UtcNow
                            .AddSeconds(DGAuthServerGlobal.Setting
                                            .RefreshTokenLifetime),

                };
                newRT.ActiveCheck();
                //db�� �߰�
                db1.DGAuthServer_RefreshToken.Add(newRT);


                //���� ��ū ���� ó��
                //��� �˻�
                IQueryable<DgAuthRefreshToken> iqFindRT
                    = db1.DGAuthServer_RefreshToken
                        .Where(w => w.idUser == idUser
                                && w.Class == sClassFinal
								&& true == w.ActiveIs);
                //linq�� �����͸� �����Ҷ��� ���� �ַ����� �ƴϴ�.
                //�ݺ������� ���������ϴ� ���� �ξ� ���ɿ� ������ �ȴ�.
                foreach (DgAuthRefreshToken itemURT in iqFindRT)
                {
                    //���� �ð��� ������
                    itemURT.RevokeTime = dtNow;
                    itemURT.ActiveCheck();
                }

            }//end if (true == bNew)

            db1.SaveChanges();
        }//end using db1


		//���÷��� ��ū�� �����Ѵ�.
		this.Cookie_RefreshToken(
			sReturn
			, bRefreshTokenLifetimeUse
			, request
			, response);

		return sReturn;
    }

	/// <summary>
	/// ���÷��� ��ū���� ���� ������ȣ�� ã�´�.
	/// </summary>
	/// <remarks>
	/// ���÷��� ��ū�� ��ȿ���� �Ѽյƴٸ� 0�� ���޵ȴ�.
	/// </remarks>
	/// <param name="request"></param>
	/// <returns>��ū�� ��ȿ���� ������ 0</returns>
	public long RefreshTokenFindUser(HttpRequest request)
    {
        long idUser = 0;
        string sTokenFinal = this.CookieGet_RefreshToken(request);
        string sClassFinal = this.CookieGet_Class(request);

		using (DgAuthDbContext db1 = new DgAuthDbContext())
        {
            DgAuthRefreshToken? findRT
                = db1.DGAuthServer_RefreshToken
                    .Where(w => w.RefreshToken == sTokenFinal
							&& w.ActiveIs == true
                            && w.Class == sClassFinal)
                    .FirstOrDefault();

            if (null != findRT)
            {//ã��

                //��ū�� ��ȿ���� Ȯ��
                findRT.ActiveCheck();
                if (true == findRT.ActiveIs)
                {//��ȿ�ϴ�
                    idUser = findRT.idUser;
                }
                else
                {//�ƴϴ�.
                    idUser = 0;
                }
            }
            else
            {
                idUser = 0;
            }

            db1.SaveChanges();
        }//end using db1

        return idUser;
    }

	/// <summary>
	/// ����������ū�� ���� ó���Ѵ�.
	/// </summary>
	/// <param name="bAllRevoke">Ŭ������ ������� ��ü ���÷��� ��ū�� ����ũ�Ѵ�.</param>
	/// <param name="idUser"></param>
	/// <param name="sClass">�� ��ū�� �з��ϱ� ���� �̸�</param>
	/// <param name="request"></param>
	/// <param name="response"></param>
	public void RefreshTokenRevoke(
        bool bAllRevoke
        , long idUser
		, HttpRequest request
		, HttpResponse response)
    {
        //���� �ð�
        DateTime dtNow = DateTime.Now;

        using (DgAuthDbContext db1 = new DgAuthDbContext())
        {
            //��ū ����
            string sClassFinal = this.CookieGet_Class(request);

			IQueryable<DgAuthRefreshToken> iqFindRT;

            if (true == bAllRevoke)
            {//��ü ����ũ
                iqFindRT = db1.DGAuthServer_RefreshToken
                        .Where(w => w.idUser == idUser);
            }
            else
            {
                iqFindRT = db1.DGAuthServer_RefreshToken
                        .Where(w => w.idUser == idUser
                                && w.Class == sClassFinal);
            }


            //linq�� �����͸� �����Ҷ��� ���� �ַ����� �ƴϴ�.
            //�ݺ������� ���������ϴ� ���� �ξ� ���ɿ� ������ �ȴ�.
            foreach (DgAuthRefreshToken itemURT in iqFindRT)
            {
                //���� �ð��� ������
                itemURT.RevokeTime = dtNow;
                itemURT.ActiveCheck();
            }

            db1.SaveChanges();
        }//end using db1


		//���÷��� ��ū�� ������ �����Ѵ�.
		this.Cookie_RefreshToken(
			string.Empty
			, false
			, request
			, response);
	}


	/// <summary>
	/// HttpContext.User�� Ŭ������ �˻��Ͽ� ���� ���������� �޴´�.
	/// </summary>
	/// <remarks>
	/// 'CookieOnly'�迭�� �ɼ��� ������̶�� �ű⿡ �°� �ڵ����� ��Ű�� ����Ѵ�.
	/// </remarks>
	/// <param name="claimsPrincipal"></param>
	/// <returns></returns>
	public long? ClaimDataGet(ClaimsPrincipal claimsPrincipal)
    {
        //�������� Ȯ��
        long nUser = 0;
        foreach (Claim item in claimsPrincipal.Claims.ToArray())
        {
            if (item.Type == DGAuthServerGlobal.Setting.UserIdName)
            {//���� ������ �ִ�.
                nUser = Convert.ToInt64(item.Value);
                break;
            }
        }

        return nUser;
    }


	/// <summary>
	/// ���޵� ��ū�� �ߺ��Ǿ��ִ��� Ȯ��
	/// </summary>
	/// <param name="sToken"></param>
	/// <returns>true:�ߺ�</returns>
	private bool RefreshTokenGenerate_OverflowCheck(string sToken)
    {
        bool bReturn = false;

        using (DgAuthDbContext db1 = new DgAuthDbContext())
        {
            //����ִ� ��ū�� ���� ��ū �ִ��� �˻�
            DgAuthRefreshToken? findRT
                = db1.DGAuthServer_RefreshToken
                    .Where(w => w.RefreshToken == sToken
                            && w.ActiveIs == true)
                    .FirstOrDefault();

            if (null != findRT)
            {//�˻��� ���� �ִ�.

                //��ȿ���˻縦 ���ְ�
                findRT.ActiveCheck();
                if (true == findRT.ActiveIs)
                {//������ ����ִ�.

                    //�ߺ�
                    bReturn = true;
                }
                else
                {
                    bReturn = false;
                }

                //��ȿ�� �˻� ����
                db1.SaveChanges();
            }
            else
            {
                bReturn = false;
            }
            
        }//end using db1

        return bReturn;
    }//end RefreshTokenGenerate()

	/// <summary>
	/// ��Ű�� ������ ��ū ������ ��û�Ѵ�.
	/// </summary>
	/// <param name="sToken"></param>
	/// <param name="bAccessTokenLifetimeUse">AccessTokenLifetime ������� ����. 
	/// ������� ������ ��Ű�� �����ð��� 1���� �����ȴ�.</param>
	/// <param name="response">�߰� ó���� ���� ��������</param>
	public void Cookie_AccessToken(
        string sToken
        , bool bAccessTokenLifetimeUse
		, HttpResponse response)
    {
		int nAccessTokenLifetime = 1;
		if (true == bAccessTokenLifetimeUse)
		{
			nAccessTokenLifetime = DGAuthServerGlobal.Setting.AccessTokenLifetime;
		}

		//������ ��ū�� ������ ����� ������� ������ �ð���ŭ �����ؾ� �ϹǷ�
		//Expires = null ó���� ���� �ʴ´�.

		CookieOptions cookieOptions = new CookieOptions
        {
			//SameSite = SameSiteMode.None,
			HttpOnly = DGAuthServerCookieGlobal.Setting.Cookie_HttpOnly,
			Secure = DGAuthServerCookieGlobal.Setting.Cookie_Secure,
			Expires = DateTime.UtcNow
                        .AddSeconds(nAccessTokenLifetime)
        };
        response.Cookies.Append(
			DGAuthServerCookieGlobal.Setting.AccessTokenCookieName
            , sToken
            , cookieOptions);
    }

	/// <summary>
	/// ��Ű�� ���÷��� ��ū ������ ��û�Ѵ�.
	/// </summary>
	/// <param name="sToken"></param>
	/// <param name="bRefreshTokenLifetimeUse">RefreshTokenLifetime�� ������� ����. 
	/// ������� ������ �����ð��� 1���� �����ȴ�.
	/// ��, 'AutoSigninCookieIs'�ɼ��� ������̸� �켱������ �ڷ� �и���.</param>
	/// <param name="request">�߰� ó���� ���� ��������</param>
	/// <param name="response">�߰� ó���� ���� ��������</param>
	internal void Cookie_RefreshToken(
        string sToken
        , bool bRefreshTokenLifetimeUse
		, HttpRequest request
		, HttpResponse response)
    {
		int nRefreshTokenLifetime = -1;

        if (true == DGAuthServerCookieGlobal.Setting.AutoSigninCookieIs)
        {
			string? sSigninAuto = request.Cookies[DGAuthServerCookieGlobal.Setting.AutoSigninCookieName];
			bool bSigninAuto = false;
			if (null != sSigninAuto)
			{
				int nSigninAuto = Convert.ToInt32(sSigninAuto);
				if (0 != nSigninAuto)
				{
					//�ڵ� ������ ���
					//�ڵ� �������� ���÷�����ū�� ������ �ִ�ġ�� �����Ѵ�.
					bSigninAuto = true;
				}
			}

            if (true == bSigninAuto)
			{//������̴�.

                //�ڵ� ������ ������̸� ���÷�����ū�� ������ �ִ�ġ�� �����Ѵ�.
				nRefreshTokenLifetime = 2147483647;
			}
		}


        if (0 >= nRefreshTokenLifetime)
        {//������ 0���ϴ�

            //AutoSigninCookieIs�� ������ �������� �ʾҴٴ� �ǹ̴�.
            if (true == bRefreshTokenLifetimeUse)
            {
                nRefreshTokenLifetime = DGAuthServerGlobal.Setting.RefreshTokenLifetime;
            }
		}


        //��Ű ����
        DateTimeOffset? dtoExpires = null;

		if (0 < nRefreshTokenLifetime)
		{//��Ű ���� ����
            dtoExpires = DateTime.UtcNow.AddSeconds(nRefreshTokenLifetime);
		}


		CookieOptions cookieOptions = new CookieOptions
		{
			//SameSite = SameSiteMode.None,
			HttpOnly = DGAuthServerCookieGlobal.Setting.Cookie_HttpOnly,
			Secure = DGAuthServerCookieGlobal.Setting.Cookie_Secure,
			Expires = dtoExpires
		};
		response.Cookies.Append(
			DGAuthServerCookieGlobal.Setting.RefreshTokenCookieName
			, sToken
			, cookieOptions);
	}

	/// <summary>
	/// ��⿡ ���÷��� ��ū ������ ��û�Ѵ�.
	/// </summary>
	/// <param name="sToken"></param>
	/// <param name="bRefreshTokenLifetimeUse">RefreshTokenLifetime�� ������� ����. 
	/// ������� ������ �����ð��� 1���� �����ȴ�.</param>
	/// <param name="response">�߰� ó���� ���� ��������</param>
	public void Cookie_RefreshToken(
        string sToken
        , bool bRefreshTokenLifetimeUse
		, HttpResponse response)
    {
        int nRefreshTokenLifetime = -1;
        
        if (true == bRefreshTokenLifetimeUse)
        {
            nRefreshTokenLifetime = DGAuthServerGlobal.Setting.RefreshTokenLifetime;
        }


		//��Ű ����
		DateTimeOffset? dtoExpires = null;

		if (0 < nRefreshTokenLifetime)
		{//��Ű ���� ����
			dtoExpires = DateTime.UtcNow.AddSeconds(nRefreshTokenLifetime);
		}

		CookieOptions cookieOptions = new CookieOptions
        {
			//SameSite = SameSiteMode.None,
			HttpOnly = DGAuthServerCookieGlobal.Setting.Cookie_HttpOnly,
			Secure = DGAuthServerCookieGlobal.Setting.Cookie_Secure,
			Expires = dtoExpires
		};
        response.Cookies.Append(
			DGAuthServerCookieGlobal.Setting.RefreshTokenCookieName
            , sToken
            , cookieOptions);
    }

    /// <summary>
    /// ��Ű���� ����������ū�� ������ �´�.
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    public string CookieGet_RefreshToken(HttpRequest request)
    {
		string sReturn = string.Empty;
		string? sResult 
            = request.Cookies[DGAuthServerCookieGlobal.Setting
                                .RefreshTokenCookieName];

		if (null != sResult)
		{
			sReturn = sResult.ToString();
		}

		return sReturn;
	}

	/// <summary>
	/// ��ū ���� ��Ű ���� ��û
	/// </summary>
	/// <param name="sClass"></param>
	/// <param name="response"></param>
	public void Cookie_Class(string sClass, HttpResponse response)
	{
        //����ð��� ������ �ִ밪�̴�.
        CookieOptions cookieOptions = new CookieOptions
        {
			//SameSite = SameSiteMode.None,
			HttpOnly = DGAuthServerCookieGlobal.Setting.Cookie_HttpOnly,
			Secure = DGAuthServerCookieGlobal.Setting.Cookie_Secure,
			Expires = DateTime.UtcNow
                        .AddSeconds(2147483647)
        };
		response.Cookies.Append(
			DGAuthServerCookieGlobal.Setting.ClassCookieName
			, sClass
			, cookieOptions);
	}

	/// <summary>
	/// ��ū ���� ��Ű �������� ��û
	/// </summary>
	/// <param name="request"></param>
	/// <returns></returns>
	public string CookieGet_Class(HttpRequest request)
    {
        string sReturn = string.Empty;
        string? sResult = request.Cookies[DGAuthServerCookieGlobal.Setting.ClassCookieName];

        if (null != sResult)
        {
            sReturn = sResult.ToString();
		}

        return sReturn;
	}

	/// <summary>
	/// �ڵ� ������ Ȱ��ȭ ���θ� ��Ű�κ��� �о �����Ѵ�.
	/// </summary>
	/// <param name="request"></param>
	/// <returns></returns>
	public bool Cookie_AutoSignin(HttpRequest request)
    {
        bool bReturn = false;

		string? sTokenTemp
	        = request.Cookies[DGAuthServerCookieGlobal.Setting.AutoSigninCookieName];
		if (null != sTokenTemp)
		{//�˻��� ���� ������ ����

            int nData = 0;
			Int32.TryParse(sTokenTemp, out nData);

            if (0 != nData)
            {//0�� �ƴ� ���� �� �ִ�.
                bReturn = true;
			}
		}


		return bReturn;
    }

	/// <summary>
	/// ������ �ִ� ���÷��� ��ū�� ���Ῡ�θ� Ȯ���ϰ�
	/// ����� ��ū�� DB���� �����.
	/// </summary>
	public void DbClear()
    {
        //���̺� ����
        using (DgAuthDbContext db1 = new DgAuthDbContext())
        {
            //�̹� ������� ���� ����Ʈ �˻�
            IQueryable<DgAuthRefreshToken> findList
                = db1.DGAuthServer_RefreshToken
                    .Where(w => w.ActiveIs == true);

            //��ū üũ
            foreach (DgAuthRefreshToken itemRT in findList)
            {
                itemRT.ActiveCheck();
            }

            //üũ�Ȱ� �����ϰ�
            db1.SaveChanges();
		}

        using (DgAuthDbContext db2 = new DgAuthDbContext())
        {
			//�̹� ����� ����Ʈ �˻�
			IQueryable<DgAuthRefreshToken> findEndList
				= db2.DGAuthServer_RefreshToken
					.Where(w => w.ActiveIs == false);
            if (null != findEndList)
            {
                //�����
                db2.DGAuthServer_RefreshToken.RemoveRange(findEndList);
            }

			db2.SaveChanges();
		}

        //������ �ð� ���
        DGAuthServerGlobal.DbClearTime = DateTime.Now;
        //���� �����ð� ���
        DGAuthServerGlobal.DbClearExpectedTime
            = DGAuthServerGlobal.DbClearTime
                .AddSeconds(DGAuthServerGlobal.Setting.DbClearTime);

    }

    /// <summary>
    /// �޸� ĳ���� ��ũ�� Ű�� �����Ѵ�.
    /// </summary>
    /// <param name="idUser"></param>
    /// <param name="sSecret"></param>
    private void MemoryCacheSaveSecret(long idUser, string sSecret)
    {
        //�޸� ĳ���� �����Ѵ�.
        ICacheEntry cacheEntry
            = DGAuthServerGlobal.MemoryCache!
                .CreateEntry(DGAuthServerCookieGlobal.Setting.AccessTokenCookieName + idUser);
        cacheEntry.SetValue(sSecret);
    }

    /// <summary>
    /// �޸� ĳ������ ��ũ�� Ű�� ã�� �����Ѵ�.
    /// </summary>
    /// <param name="idUser"></param>
    /// <param name="sSecret"></param>
    /// <returns></returns>
    private bool MemoryCacheFindSecret(long idUser, out string sSecret)
    {
        bool bReturn = false;

        bReturn
            = DGAuthServerGlobal.MemoryCache!
                .TryGetValue(DGAuthServerCookieGlobal.Setting.AccessTokenCookieName + idUser
                                , out sSecret);
        if (null == sSecret)
        {
            sSecret = string.Empty;
        }
        
        return bReturn;
    }
}